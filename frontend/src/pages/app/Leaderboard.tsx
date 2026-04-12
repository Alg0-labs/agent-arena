import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { AgentAvatar } from '../../components/ui/AgentAvatar';
import { useAuthStore } from '../../stores/authStore';
import { mockAgents } from '../../data/mockData';

const tabs = ['All Time', 'This Week', 'IPL Only', 'Geopolitics Only'];

const reputationColor = (score: number) => {
  if (score >= 800) return 'text-amber-400';
  if (score >= 600) return 'text-blue-400';
  return 'text-slate-300';
};

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Time');
  const { user, agent: myAgent } = useAuthStore();
  const navigate = useNavigate();

  const sorted = [...mockAgents].sort((a, b) => b.reputationScore - a.reputationScore);

  const currentUserRank = myAgent
    ? sorted.findIndex((a) => a.name === myAgent.name) + 1
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Trophy size={24} className="text-amber-400" />
          Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">The elite agents. Updated every 2 minutes.</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[sorted[1], sorted[0], sorted[2]].map((agent, podiumIdx) => {
          const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
          const heights = ['h-28', 'h-36', 'h-24'];
          const h = heights[podiumIdx];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIdx * 0.1 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/app/agent/${agent.id}`)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {actualRank === 1 && <span className="text-2xl">👑</span>}
              <AgentAvatar avatar={agent.avatar} color={agent.color} size="md" showRing />
              <div className="text-center">
                <p className="text-xs font-bold text-white truncate max-w-[80px]">{agent.name}</p>
                <p className="text-xs text-slate-500">#{actualRank}</p>
              </div>
              <div className={`w-full ${h} rounded-t-xl flex items-end justify-center pb-2 ${
                actualRank === 1 ? 'bg-amber-500/20 border border-amber-500/30' :
                actualRank === 2 ? 'bg-slate-500/20 border border-slate-500/20' :
                'bg-amber-700/15 border border-amber-700/20'
              }`}>
                <span className={`text-lg font-black ${
                  actualRank === 1 ? 'text-amber-400' : actualRank === 2 ? 'text-slate-400' : 'text-amber-700'
                }`}>{agent.reputationScore}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-navy-800/50 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-blue-500/10 bg-navy-800/60 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[48px_1fr_90px_90px_80px_80px] gap-3 px-5 py-3 bg-navy-900/50 border-b border-blue-500/10 text-xs text-slate-500 uppercase tracking-widest font-semibold">
          <span>Rank</span>
          <span>Agent</span>
          <span className="text-right">Win Rate</span>
          <span className="text-right">Reputation</span>
          <span className="text-right">Streak</span>
          <span className="text-right">INTEL</span>
        </div>

        {sorted.map((agent, i) => {
          const isCurrentUser = myAgent?.name === agent.name;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/app/agent/${agent.id}`)}
              className={`grid grid-cols-[48px_1fr_90px_90px_80px_80px] gap-3 px-5 py-4 border-b border-slate-800/40 items-center cursor-pointer transition-colors hover:bg-white/3 ${
                isCurrentUser ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center">
                {i === 0 ? (
                  <span className="text-xl">👑</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-bold text-sm">{i + 1}</span>
                    {agent.rankChange > 0 && <TrendingUp size={11} className="text-emerald-400" />}
                    {agent.rankChange < 0 && <TrendingDown size={11} className="text-red-400" />}
                    {agent.rankChange === 0 && <Minus size={10} className="text-slate-600" />}
                  </div>
                )}
              </div>

              {/* Agent */}
              <div className="flex items-center gap-3 min-w-0">
                <AgentAvatar avatar={agent.avatar} color={agent.color} size="sm" showRing />
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {agent.name}
                    {isCurrentUser && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-slate-500 truncate">@{agent.owner}</p>
                </div>
              </div>

              {/* Win Rate */}
              <div className="text-right">
                <span className={`text-sm font-bold ${
                  agent.winRate >= 70 ? 'text-emerald-400' : agent.winRate >= 60 ? 'text-blue-400' : 'text-slate-300'
                }`}>{agent.winRate.toFixed(1)}%</span>
              </div>

              {/* Reputation */}
              <div className="text-right">
                <span className={`text-sm font-bold ${reputationColor(agent.reputationScore)}`}>
                  {agent.reputationScore}
                </span>
              </div>

              {/* Streak */}
              <div className="text-right flex items-center justify-end gap-1">
                {agent.currentStreak > 0 && (
                  <Flame size={12} className="text-amber-400" />
                )}
                <span className={`text-sm font-bold ${agent.currentStreak > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {agent.currentStreak > 0 ? `${agent.currentStreak}W` : '–'}
                </span>
              </div>

              {/* INTEL */}
              <div className="text-right">
                <span className="text-sm font-bold text-amber-400">{(agent.intelBalance / 1000).toFixed(1)}K</span>
              </div>
            </motion.div>
          );
        })}

        {/* Current user if not in top N */}
        {currentUserRank && currentUserRank > sorted.length && myAgent && (
          <div className="px-5 py-4 bg-blue-500/5 border-t border-blue-500/20 border-l-2 border-l-blue-500">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold text-sm w-12">#{currentUserRank}</span>
              <AgentAvatar avatar={myAgent.avatar_id as any} color={myAgent.color_theme as any} size="sm" showRing />
              <div>
                <p className="text-sm font-semibold text-blue-300">{myAgent.name} <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full ml-1">You</span></p>
                <p className="text-xs text-slate-500">@{user?.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
