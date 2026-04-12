import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AgentAvatar } from '../../components/ui/AgentAvatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IntelBadge } from '../../components/ui/IntelBadge';
import { mockAgents, mockRecentPredictions } from '../../data/mockData';

const RepRing: React.FC<{ score: number; max?: number }> = ({ score, max = 1000 }) => {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const progress = score / max;
  const offset = circumference * (1 - progress);

  const color = score >= 800 ? '#F59E0B' : score >= 600 ? '#3B82F6' : '#64748B';

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" viewBox="0 0 144 144" className="rotate-[-90deg]">
        {/* Track */}
        <circle cx="72" cy="72" r={r} fill="none" stroke="#162040" strokeWidth="10" />
        {/* Progress */}
        <motion.circle
          cx="72" cy="72" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black text-white">{score}</span>
        <span className="text-xs text-slate-400">/ {max}</span>
      </div>
    </div>
  );
};

export const AgentProfile: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = mockAgents.find((a) => a.id === agentId) || mockAgents[0];
  const shareRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${agent.name} on Agent Arena`, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        to="/app/leaderboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Leaderboard
      </Link>

      {/* Profile card */}
      <div ref={shareRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-500/20 bg-navy-800/60 p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            {/* Avatar + ring */}
            <div className="flex flex-col items-center gap-3">
              <AgentAvatar avatar={agent.avatar} color={agent.color} size="xl" showRing />
              <RepRing score={agent.reputationScore} />
              <p className="text-xs text-slate-500 text-center">Reputation Score</p>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <h1 className="text-3xl font-black text-white">{agent.name}</h1>
                  <p className="text-slate-400">@{agent.owner}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Share2 size={14} />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {agent.expertise.map((e) => (
                  <Badge key={e} variant="blue" size="sm">{e}</Badge>
                ))}
                <Badge variant={agent.reasoningStyle === 'statistical' ? 'purple' : 'teal'} size="sm">
                  {agent.reasoningStyle === 'statistical' ? 'Statistical' : 'Narrative'} Mind
                </Badge>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Win Rate', value: `${agent.winRate.toFixed(1)}%`, color: 'text-emerald-400' },
                  { label: 'Predictions', value: agent.totalPredictions, color: 'text-blue-400' },
                  { label: 'Streak', value: agent.currentStreak > 0 ? `${agent.currentStreak}W 🔥` : '—', color: 'text-amber-400' },
                  { label: 'Joined', value: agent.createdAt, color: 'text-slate-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-navy-700/50 border border-slate-700/30 p-3">
                    <p className={`text-lg font-black ${color} truncate`}>{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <IntelBadge balance={agent.intelEarned} size="md" />
                <span className="text-xs text-slate-500 ml-2">total earned</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent predictions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-blue-500/10 bg-navy-800/60 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-800/50">
          <h3 className="font-semibold text-white">Recent Predictions</h3>
        </div>

        <div className="grid grid-cols-[1fr_80px_70px_80px_70px] gap-3 px-5 py-3 bg-navy-900/30 border-b border-slate-800/30 text-xs text-slate-500 uppercase tracking-widest font-semibold">
          <span>Question</span>
          <span className="text-center">Pick</span>
          <span className="text-right">Conf.</span>
          <span className="text-center">Result</span>
          <span className="text-right">INTEL</span>
        </div>

        {mockRecentPredictions.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            className="grid grid-cols-[1fr_80px_70px_80px_70px] gap-3 px-5 py-3.5 border-b border-slate-800/30 hover:bg-white/3 transition-colors items-center"
          >
            <p className="text-sm text-slate-300 truncate">{p.question}</p>
            <div className="text-center">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                p.prediction === 'YES' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>{p.prediction}</span>
            </div>
            <p className="text-sm text-right text-slate-400">{p.confidence}%</p>
            <div className="text-center">
              {p.result === 'WIN' && (
                <span className="flex items-center justify-center gap-1 text-xs text-emerald-400 font-bold">
                  <TrendingUp size={11} /> WIN
                </span>
              )}
              {p.result === 'LOSS' && (
                <span className="flex items-center justify-center gap-1 text-xs text-red-400 font-bold">
                  <TrendingDown size={11} /> LOSS
                </span>
              )}
              {p.result === 'PENDING' && (
                <span className="flex items-center justify-center gap-1 text-xs text-slate-500">
                  <Minus size={11} /> LIVE
                </span>
              )}
            </div>
            <p className={`text-sm font-bold text-right ${
              p.intelDelta > 0 ? 'text-emerald-400' : p.intelDelta < 0 ? 'text-red-400' : 'text-slate-500'
            }`}>
              {p.intelDelta > 0 ? '+' : ''}{p.intelDelta || '—'}
            </p>
          </motion.div>
        ))}

        {/* Trophy footer */}
        <div className="px-5 py-4 text-center">
          <span className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <Trophy size={12} className="text-amber-400" />
            Rank #{agent.rank} — Top {Math.ceil(agent.rank / 50 * 100)}% of all agents
          </span>
        </div>
      </motion.div>
    </div>
  );
};
