import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, Swords } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AgentAvatar } from '../ui/AgentAvatar';

interface Battle {
  id: string;
  question: string;
  category: string;
  categoryEmoji: string;
  agentA: {
    id: string;
    name: string;
    avatar: string;
    color: string;
    owner: string;
  };
  agentB: {
    id: string;
    name: string;
    avatar: string;
    color: string;
    owner: string;
  };
  agentAPosition: string;
  agentBPosition: string;
  agentAConfidence: number;
  agentBConfidence: number;
  crowdVoteA: number;
  crowdVoteB: number;
  status: string;
  timeRemaining: string;
  totalVotes: number;
}

interface BattleCardProps {
  battle: Battle;
  compact?: boolean;
}

const confidenceColor = (conf: number) => {
  if (conf >= 70) return 'bg-emerald-500';
  if (conf >= 55) return 'bg-blue-500';
  return 'bg-amber-500';
};

export const BattleCard: React.FC<BattleCardProps> = ({ battle, compact }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-blue-500/10 bg-navy-800/60 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{battle.categoryEmoji}</span>
          <span className="text-xs text-slate-400 font-medium">{battle.category}</span>
          {battle.status === 'live' && <Badge variant="live" pulse>LIVE</Badge>}
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Clock size={12} />
          <span>{battle.timeRemaining}</span>
        </div>
      </div>

      {/* Question */}
      <p className="px-5 font-semibold text-white text-sm md:text-base leading-snug mb-5">
        {battle.question}
      </p>

      {/* Agents face-off */}
      <div className="px-5 mb-4">
        <div className="flex items-start gap-3">
          {/* Agent A */}
          <div className="flex-1 rounded-xl bg-navy-700/50 border border-blue-500/10 p-3">
            <div className="flex items-center gap-2 mb-2">
              <AgentAvatar avatar={battle.agentA.avatar} color={battle.agentA.color} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{battle.agentA.name}</p>
                <p className="text-[10px] text-slate-500">@{battle.agentA.owner}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                battle.agentAPosition === 'YES' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {battle.agentAPosition}
              </span>
              <span className="text-xs font-bold text-white">{battle.agentAConfidence}%</span>
            </div>
            <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battle.agentAConfidence}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full rounded-full ${confidenceColor(battle.agentAConfidence)}`}
              />
            </div>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center justify-center pt-3">
            <div className="w-8 h-8 rounded-full bg-navy-700 border border-blue-500/20 flex items-center justify-center">
              <Swords size={14} className="text-blue-400" />
            </div>
          </div>

          {/* Agent B */}
          <div className="flex-1 rounded-xl bg-navy-700/50 border border-purple-500/10 p-3">
            <div className="flex items-center gap-2 mb-2">
              <AgentAvatar avatar={battle.agentB.avatar} color={battle.agentB.color} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{battle.agentB.name}</p>
                <p className="text-[10px] text-slate-500">@{battle.agentB.owner}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                battle.agentBPosition === 'YES' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {battle.agentBPosition}
              </span>
              <span className="text-xs font-bold text-white">{battle.agentBConfidence}%</span>
            </div>
            <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battle.agentBConfidence}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-full rounded-full ${confidenceColor(battle.agentBConfidence)}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crowd vote */}
      {!compact && (
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users size={11} />
              Crowd: {battle.crowdVoteA}% back {battle.agentA.name}
            </span>
            <span>{battle.totalVotes.toLocaleString()} votes</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${battle.crowdVoteA}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full bg-blue-500/60 rounded-l-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${battle.crowdVoteB}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full bg-purple-500/60 rounded-r-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-5">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          iconRight={<ArrowRight size={14} />}
          onClick={() => navigate(`/app/battles/${battle.id}`)}
        >
          Watch Battle
        </Button>
      </div>
    </motion.div>
  );
};
