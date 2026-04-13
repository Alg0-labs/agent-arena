"""
IPL Market Resolver — ALG-30
Polls CricAPI for completed IPL matches and auto-resolves prediction markets.

Scheduler: runs every 5 minutes.
"""
import logging
from datetime import datetime
from typing import Any, Dict, Optional

from config import settings
from database.mongodb import get_db
from utils.websocket_manager import ws_manager

logger = logging.getLogger(__name__)


# ── CricAPI helpers ───────────────────────────────────────────────────────────

async def _fetch_match_info(match_id: str) -> Optional[Dict[str, Any]]:
    """
    Return match data dict from CricAPI.
    Delegates to the shared Redis-cached helper in cricket_tool so the resolver
    shares the same 30s cache as the live-feed endpoint and battle_updater.
    """
    from agentic.tools.cricket_tool import _fetch_match_info as _cached_fetch
    return await _cached_fetch(match_id)


def _match_ended(match_data: Dict) -> bool:
    """Return True if the match has a definitive result."""
    if match_data.get("matchEnded") is True:
        return True
    status = match_data.get("status", "").lower()
    END_SIGNALS = ("won", "win ", "lost", "abandoned", "no result", "tied", "draw")
    return any(sig in status for sig in END_SIGNALS)


def _determine_outcome(match_data: Dict, resolution_key: str) -> Optional[str]:
    """
    Map match_data + resolution_key → 'yes' | 'no' | None (match not finished).

    Supported resolution_key formats:
      winner:<team_name>             → YES if <team_name> appears in match status as winner
      score_over:<runs>:<team_name>  → YES if <team_name>'s score (runs) > <runs>
    """
    if not _match_ended(match_data):
        return None

    status = match_data.get("status", "").lower()

    if resolution_key.startswith("winner:"):
        expected = resolution_key[len("winner:"):].strip().lower()
        return "yes" if expected in status else "no"

    if resolution_key.startswith("score_over:"):
        # "score_over:180:Mumbai Indians"
        parts = resolution_key.split(":", 2)
        if len(parts) == 3:
            try:
                threshold = int(parts[1])
            except ValueError:
                return None
            team = parts[2].strip().lower()
            for entry in match_data.get("score", []):
                if team in entry.get("inning", "").lower():
                    runs = int(entry.get("r", 0))
                    return "yes" if runs > threshold else "no"

    return None


# ── Main scheduler task ───────────────────────────────────────────────────────

async def resolve_ipl_markets() -> None:
    """
    Finds CricAPI-sourced markets past their closes_at, fetches match result,
    and resolves predictions + battles.  Called every 5 minutes by APScheduler.
    """
    if not settings.cricapi_key or settings.cricapi_key in ("", "your_cricapi_key_here"):
        return

    db = get_db()
    now = datetime.utcnow()

    expired = await db.markets.find({
        "source": "cricapi",
        "is_resolved": False,
        "closes_at": {"$lt": now},
    }).to_list(20)

    if not expired:
        return

    logger.info(f"IPL resolver: {len(expired)} expired CricAPI market(s) to check")

    for market_doc in expired:
        match_id = market_doc.get("match_id")
        resolution_key = market_doc.get("resolution_key", "")
        external_id = market_doc.get("external_id", str(market_doc["_id"]))

        if not match_id:
            logger.warning(f"IPL resolver: market {external_id} has no match_id — skipping")
            continue

        match_data = await _fetch_match_info(match_id)
        if not match_data:
            continue

        resolved_outcome = _determine_outcome(match_data, resolution_key)
        if not resolved_outcome:
            logger.info(
                f"IPL resolver: match {match_id} not yet complete "
                f"(status='{match_data.get('status', 'unknown')}') — will retry"
            )
            continue

        question = market_doc.get("question", "")
        logger.info(f"IPL resolver: resolving '{question}' → {resolved_outcome.upper()}")

        # Mark market resolved with a decisive price (used by resolution_runner fallback)
        yes_price = 0.98 if resolved_outcome == "yes" else 0.02
        await db.markets.update_one(
            {"_id": market_doc["_id"]},
            {
                "$set": {
                    "is_resolved": True,
                    "resolution": resolved_outcome,
                    "yes_price": yes_price,
                    "no_price": round(1.0 - yes_price, 2),
                    "updated_at": now,
                }
            },
        )

        # Settle predictions
        pending_preds = await db.predictions.find({
            "market_id": external_id,
            "status": "pending",
        }).to_list(500)

        for pred in pending_preds:
            pred_id = str(pred["_id"])
            try:
                from services.prediction_service import resolve_prediction
                await resolve_prediction(pred_id, resolved_outcome)

                user_id = pred.get("user_id")
                if user_id:
                    won = pred.get("predicted_outcome", "").lower() == resolved_outcome
                    await ws_manager.send_to_user(
                        user_id,
                        "prediction_resolved",
                        {
                            "prediction_id": pred_id,
                            "market_question": pred.get("market_question", ""),
                            "outcome": resolved_outcome,
                            "won": won,
                        },
                    )
            except Exception as e:
                logger.error(f"IPL resolver: prediction {pred_id} resolution failed: {e}")

        # Settle battles
        active_battles = await db.battles.find({
            "market_id": external_id,
            "status": "active",
        }).to_list(50)

        for battle in active_battles:
            battle_id = str(battle["_id"])
            try:
                from services.battle_service import resolve_battle
                await resolve_battle(battle_id, resolved_outcome)
                await ws_manager.broadcast(
                    "battle_update",
                    {
                        "battle_id": battle_id,
                        "status": "resolved",
                        "market_outcome": resolved_outcome,
                    },
                )
            except Exception as e:
                logger.error(f"IPL resolver: battle {battle_id} resolution failed: {e}")

        logger.info(
            f"IPL resolver: {external_id} → {resolved_outcome.upper()} "
            f"({len(pending_preds)} prediction(s), {len(active_battles)} battle(s) settled)"
        )
