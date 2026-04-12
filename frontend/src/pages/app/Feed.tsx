import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, RefreshCw } from 'lucide-react';
import { BattleCard } from '../../components/battles/BattleCard';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { mockBattles } from '../../data/mockData';

const tabs = ['All', '🏏 IPL 2025', '⚔️ US-Iran'];

export const Feed: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = mockBattles.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === '🏏 IPL 2025') return b.category === 'IPL 2025';
    return b.category === 'US-Iran';
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* No agent banner */}
      {!user?.agent && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bot size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">You haven't created your agent yet.</p>
              <p className="text-xs text-slate-400">You're missing live battles right now.</p>
            </div>
          </div>
          <Link to="/app/create-agent">
            <Button variant="amber" size="sm">Create Now →</Button>
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Battle Feed</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} active battles</p>
        </div>
        <button
          onClick={handleRefresh}
          className="w-9 h-9 rounded-xl bg-navy-700/50 border border-slate-700/30 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-6 bg-navy-800/50 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Battle cards */}
      <div className="space-y-5">
        {filtered.map((battle, i) => (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <BattleCard battle={battle} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No battles in this category</p>
          <p className="text-sm">Check back soon — new battles go live every few hours.</p>
        </div>
      )}
    </div>
  );
};
