"""
IPL Market Seeder — ALG-30
Fetches upcoming/current IPL matches from CricAPI, generates YES/NO prediction
markets using Claude, and stores them in MongoDB.

Scheduler: runs every 30 minutes.
"""
import json
import logging
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import httpx

from config import settings
from database.mongodb import get_db

logger = logging.getLogger(__name__)

CRICAPI_BASE = "https://api.cricapi.com/v1"
_IPL_KEYWORDS = ["ipl", "indian premier league", "tata ipl"]

# IPL 2026 series ID from CricAPI (series_info endpoint)
# Update each season or add logic to auto-discover via /series?search=Indian+Premier+League+2026
IPL_2026_SERIES_ID = "87c62aac-bc3c-4738-ab93-19da0690488f"


# ── CricAPI helpers ───────────────────────────────────────────────────────────

def _is_ipl(name: str, series: str = "") -> bool:
    text = (name + " " + series).lower()
    return any(kw in text for kw in _IPL_KEYWORDS)


async def _cricapi_get(endpoint: str, extra_params: Dict = {}) -> Optional[Dict]:
    """GET a CricAPI v1 endpoint, returning the parsed JSON or None on error."""
    params = {"apikey": settings.cricapi_key, "offset": 0, **extra_params}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{CRICAPI_BASE}/{endpoint}", params=params)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return data
                logger.warning(f"CricAPI {endpoint}: status={data.get('status')} info={data.get('info')}")
    except Exception as e:
        logger.warning(f"CricAPI {endpoint} failed: {e}")
    return None


async def _resolve_current_series_id() -> Optional[str]:
    """
    Dynamically find the current year's IPL series ID via /series?search=...
    Falls back to the hardcoded IPL_2026_SERIES_ID.
    """
    import datetime as _dt
    year = _dt.datetime.utcnow().year
    data = await _cricapi_get("series", {"search": f"Indian Premier League {year}"})
    if data:
        for s in data.get("data", []):
            name = s.get("name", "")
            sid = s.get("id", "")
            if str(year) in name and "indian premier league" in name.lower() and sid:
                return sid
    return IPL_2026_SERIES_ID


async def fetch_upcoming_ipl_matches() -> List[Dict[str, Any]]:
    """
    Returns up to 5 upcoming (or ongoing) IPL matches.
    Primary source: series_info matchList (gives full season schedule).
    Fallback: currentMatches filtered for IPL.
    """
    if not settings.cricapi_key or settings.cricapi_key in ("", "your_cricapi_key_here"):
        logger.info("IPL seeder: CRICAPI_KEY not configured — skipping")
        return []

    now = datetime.utcnow()
    # Accept matches starting up to 3.5h ago (still ongoing) through end of tomorrow UTC
    window_start = now - timedelta(hours=3, minutes=30)
    window_end = now + timedelta(days=2)   # today + tomorrow only

    # ── Primary: series schedule ──────────────────────────────────────────────
    series_id = await _resolve_current_series_id()
    data = await _cricapi_get("series_info", {"id": series_id})
    if data:
        series_data = data.get("data", {})
        all_series_matches = series_data.get("matchList", [])
        upcoming: List[Dict] = []
        for m in all_series_matches:
            match_time = _parse_match_time(m)
            if match_time and window_start <= match_time <= window_end:
                upcoming.append(m)
        if upcoming:
            upcoming.sort(key=lambda m: _parse_match_time(m) or now)
            logger.info(f"IPL seeder: {len(upcoming)} upcoming/live IPL matches from series schedule")
            return upcoming[:5]

    # ── Fallback: currentMatches ──────────────────────────────────────────────
    data = await _cricapi_get("currentMatches")
    if data:
        fallback = []
        for m in data.get("data", []):
            name = m.get("name", "")
            series = m.get("series", "") or ""
            if not _is_ipl(name, series):
                continue
            match_time = _parse_match_time(m)
            if match_time and match_time >= window_start:
                fallback.append(m)
        if fallback:
            logger.info(f"IPL seeder: {len(fallback)} IPL matches from currentMatches fallback")
            return fallback[:5]

    logger.info("IPL seeder: no upcoming IPL matches found")
    return []


def _parse_match_time(match: Dict) -> Optional[datetime]:
    for field in ("dateTimeGMT", "date"):
        val = match.get(field)
        if val:
            try:
                dt = datetime.fromisoformat(str(val).replace("Z", "+00:00"))
                return dt.replace(tzinfo=None)
            except (ValueError, AttributeError):
                pass
    return None


def _extract_teams(match: Dict) -> Tuple[str, str]:
    teams = match.get("teams", [])
    if len(teams) >= 2:
        return teams[0], teams[1]
    name = match.get("name", "")
    parts = name.split(" vs ")
    if len(parts) >= 2:
        team_a = parts[0].strip()
        team_b = parts[1].split(",")[0].strip()
        return team_a, team_b
    return "Team A", "Team B"


# ── Claude question generation ────────────────────────────────────────────────

def _winner_question(team_a: str, team_b: str) -> Dict[str, Any]:
    """The mandatory match-winner question."""
    return {
        "question": f"Will {team_a} beat {team_b} in today's IPL match?",
        "yes_price": 0.50,
        "resolution_key": f"winner:{team_a}",
    }


async def _generate_questions(
    team_a: str,
    team_b: str,
    match_name: str,
) -> List[Dict[str, Any]]:
    """
    Returns a list of YES/NO questions for the match.
    - Index 0 is ALWAYS the match-winner question (guaranteed).
    - Indices 1-2 are optional extras generated by Claude.
    """
    winner_q = _winner_question(team_a, team_b)

    if not settings.anthropic_api_key:
        return [winner_q]

    try:
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=settings.anthropic_api_key)

        prompt = f"""Generate exactly 2 additional YES/NO prediction market questions for this IPL match.
Match: {match_name}
Teams: {team_a} vs {team_b}

The match-winner question already exists — do NOT add one.
Generate 2 score or performance-based questions instead.

Return ONLY a valid JSON array — no markdown, no commentary:
[
  {{
    "question": "Will {team_a} score more than 170 runs in their first innings?",
    "yes_price": 0.52,
    "resolution_key": "score_over:170:{team_a}"
  }},
  {{
    "question": "Will {team_b} score more than 160 runs in their first innings?",
    "yes_price": 0.50,
    "resolution_key": "score_over:160:{team_b}"
  }}
]

Rules:
- Questions must be decidable within 4 hours from publicly available scorecards.
- yes_price must be between 0.30 and 0.70.
- Use only "score_over:<runs>:<team_name>" resolution keys (no other formats)."""

        response = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        m = re.search(r'\[.*?\]', text, re.DOTALL)
        if m:
            extras = json.loads(m.group())
            if isinstance(extras, list):
                # Prepend guaranteed winner question, then up to 2 extras
                return [winner_q] + [q for q in extras if q.get("question")][:2]
    except Exception as e:
        logger.error(f"IPL seeder: Claude question generation failed: {e}")

    return [winner_q]


def _fallback_questions(team_a: str, team_b: str) -> List[Dict[str, Any]]:
    return [
        {
            "question": f"Will {team_a} win the IPL match against {team_b}?",
            "yes_price": 0.50,
            "resolution_key": f"winner:{team_a}",
        }
    ]


# ── Main scheduler task ───────────────────────────────────────────────────────

async def seed_ipl_markets() -> None:
    """
    Main entry point called by APScheduler every 30 minutes.
    Fetches upcoming IPL matches, generates markets via Claude, upserts to MongoDB.
    """
    matches = await fetch_upcoming_ipl_matches()
    if not matches:
        return

    db = get_db()
    seeded = 0

    for match in matches:
        match_id = match.get("id")
        if not match_id:
            continue

        match_time = _parse_match_time(match)
        if not match_time:
            match_time = datetime.utcnow() + timedelta(hours=2)

        # T20 matches last ~3.5 hours; give a 30-min buffer after
        closes_at = match_time + timedelta(hours=4)

        # Skip matches that already ended
        if closes_at < datetime.utcnow():
            logger.debug(f"IPL seeder: match {match_id} already finished — skipping")
            continue

        team_a, team_b = _extract_teams(match)
        match_name = match.get("name", f"{team_a} vs {team_b}")

        questions = await _generate_questions(team_a, team_b, match_name)

        for i, q in enumerate(questions):
            question_text = q.get("question", "")
            if not question_text:
                continue

            external_id = f"cricapi-{match_id}-{i}"

            # Idempotent: skip if market already seeded
            existing = await db.markets.find_one({"external_id": external_id})
            if existing:
                continue

            yes_price = min(max(float(q.get("yes_price", 0.50)), 0.05), 0.95)
            no_price = round(1.0 - yes_price, 4)

            doc = {
                "external_id": external_id,
                "source": "cricapi",
                "match_id": match_id,
                "resolution_key": q.get("resolution_key", f"winner:{team_a}"),
                "question": question_text,
                "yes_price": yes_price,
                "no_price": no_price,
                "volume_24h": 0.0,
                "category": "ipl",
                "closes_at": closes_at,
                "is_resolved": False,
                "resolution": None,
                "match_name": match_name,
                "team_a": team_a,
                "team_b": team_b,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }

            await db.markets.insert_one(doc)
            seeded += 1
            logger.info(f"IPL seeder: created — '{question_text}'")

    if seeded:
        logger.info(f"IPL seeder: total seeded = {seeded} new market(s)")
    else:
        logger.info("IPL seeder: no new markets to seed (all already exist)")
