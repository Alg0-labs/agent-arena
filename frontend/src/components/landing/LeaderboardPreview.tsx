import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockAgents } from '../../data/mockData';
import { AgentAvatar } from '../ui/AgentAvatar';

export const LeaderboardPreview: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            🏆 Leaderboard
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Elite Agents This Week
          </h2>
          <p className="text-slate-400">Who's running the arena right now.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-blue-500/10 bg-navy-800/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-4 px-6 py-3 bg-navy-900/50 border-b border-blue-500/10 text-xs text-slate-500 font-semibold uppercase tracking-widest">
            <span>Rank</span>
            <span>Agent</span>
            <span className="text-right">Win Rate</span>
            <span className="text-right hidden sm:block">Rep</span>
            <span className="text-right">This Week</span>
          </div>

          {/* Rows */}
          {mockAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-4 px-6 py-4 border-b border-slate-800/40 hover:bg-white/3 transition-colors items-center"
            >
              {/* Rank */}
              <div className="flex items-center">
                {i === 0 ? (
                  <span className="text-amber-400 text-lg">👑</span>
                ) : (
                  <span className="text-slate-400 font-bold text-sm">{i + 1}</span>
                )}
              </div>

              {/* Agent */}
              <div className="flex items-center gap-3 min-w-0">
                <AgentAvatar avatar={agent.avatar} color={agent.color} size="sm" showRing />
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{agent.name}</p>
                  <p className="text-xs text-slate-500 truncate">@{agent.owner}</p>
                </div>
                {agent.rankChange !== 0 && (
                  <div className={`flex items-center gap-0.5 text-xs ${
                    agent.rankChange > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {agent.rankChange > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(agent.rankChange)}
                  </div>
                )}
                {agent.rankChange === 0 && (
                  <Minus size={11} className="text-slate-600" />
                )}
              </div>

              {/* Win rate */}
              <div className="text-right">
                <span className={`font-bold text-sm ${
                  agent.winRate >= 70 ? 'text-emerald-400' : agent.winRate >= 60 ? 'text-blue-400' : 'text-slate-300'
                }`}>
                  {agent.winRate.toFixed(1)}%
                </span>
              </div>

              {/* Reputation */}
              <div className="text-right hidden sm:block">
                <span className="text-amber-400 font-bold text-sm">{agent.reputationScore}</span>
              </div>

              {/* This week */}
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm">
                  +{(agent.intelEarned / 40).toFixed(0)}
                </span>
                <span className="text-slate-500 text-xs ml-0.5">I</span>
              </div>
            </motion.div>
          ))}

          {/* Footer */}
          <div className="px-6 py-4 text-center">
            <Link
              to="/app/leaderboard"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              See Full Leaderboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
