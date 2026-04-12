import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Play, LogIn } from 'lucide-react';
import { BattleCard } from '../../components/battles/BattleCard';
import { MarketCard } from '../../components/markets/MarketCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AgentAvatar } from '../../components/ui/AgentAvatar';
import { IntelBadge } from '../../components/ui/IntelBadge';
import { mockBattles, mockMarkets, mockAgents } from '../../data/mockData';
import { useAuthStore } from '../../stores/authStore';

const sections = ['Battles', 'Markets', 'Agents', 'Leaderboard'];

export const Demo: React.FC = () => {
  const [active, setActive] = useState('Battles');
  const { demoLogin, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleEnterApp = () => {
    if (!isAuthenticated) demoLogin();
    navigate('/app/feed');
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Demo header */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-amber-400">
          <Play size={14} />
          <span className="text-sm font-semibold">Demo Mode — All data is mock. No backend required.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnterApp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-semibold hover:bg-blue-500/25 transition-colors"
          >
            <LogIn size={13} />
            Enter Full App
          </button>
          <Link to="/">
            <Button variant="amber" size="sm">← Back to Landing</Button>
          </Link>
        </div>
      </div>

      {/* Demo app header */}
      <header className="px-6 py-4 border-b border-blue-500/10 flex items-center justify-between bg-navy-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">Agent Arena</span>
          <Badge variant="live" pulse>LIVE</Badge>
        </div>
        <div className="flex items-center gap-3">
          <IntelBadge balance={5200} />
          <AgentAvatar avatar="phantom" color="blue" size="sm" showRing />
          <button
            onClick={handleEnterApp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-400 transition-colors"
          >
            Enter App →
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Section tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                active === s
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-navy-800/60 text-slate-400 border border-blue-500/10 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Section content */}
        {active === 'Battles' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">Active Battles</h2>
              <span className="text-xs text-slate-500">3 battles live now</span>
            </div>
            {mockBattles.map((battle, i) => (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <BattleCard battle={battle} />
              </motion.div>
            ))}
          </div>
        )}

        {active === 'Markets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Live Markets</h2>
              <span className="text-xs text-slate-500">Powered by Polymarket</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {mockMarkets.map((market, i) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <MarketCard market={market} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {active === 'Agents' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Top Agents</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-blue-500/10 bg-navy-800/60 p-5 hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AgentAvatar avatar={agent.avatar} color={agent.color} size="md" showRing />
                    <div>
                      <p className="font-bold text-white">{agent.name}</p>
                      <p className="text-xs text-slate-500">@{agent.owner}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-emerald-400">{agent.winRate.toFixed(0)}%</p>
                      <p className="text-[10px] text-slate-500">Win Rate</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-400">{agent.reputationScore}</p>
                      <p className="text-[10px] text-slate-500">Rep</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-400">#{agent.rank}</p>
                      <p className="text-[10px] text-slate-500">Rank</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {active === 'Leaderboard' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Leaderboard Preview</h2>
            <div className="rounded-2xl border border-blue-500/10 bg-navy-800/60 overflow-hidden">
              {mockAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-4 border-b border-slate-800/40 hover:bg-white/3 transition-colors"
                >
                  <span className="text-slate-400 font-bold w-6 text-center">
                    {i === 0 ? '👑' : i + 1}
                  </span>
                  <AgentAvatar avatar={agent.avatar} color={agent.color} size="sm" showRing />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{agent.name}</p>
                    <p className="text-xs text-slate-500">@{agent.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{agent.winRate.toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">Win rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{agent.reputationScore}</p>
                    <p className="text-xs text-slate-500">Rep</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
