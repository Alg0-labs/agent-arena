import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationsStore } from '../../stores/notificationsStore';
import { IntelBadge } from '../ui/IntelBadge';
import { AgentAvatar } from '../ui/AgentAvatar';

export const TopBar: React.FC = () => {
  const { user, agent } = useAuthStore();
  const { notifications, unreadCount, markAllRead } = useNotificationsStore();
  const [showNotifs, setShowNotifs] = useState(false);

  const typeColors: Record<string, string> = {
    win: 'text-emerald-400',
    loss: 'text-red-400',
    battle: 'text-blue-400',
    info: 'text-amber-400',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 bg-navy-900/80 backdrop-blur-xl border-b border-blue-500/10">
      {/* Mobile logo */}
      <Link to="/app/feed" className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm">Agent Arena</span>
      </Link>

      {/* Search — desktop only */}
      <div className="hidden md:flex items-center gap-2 bg-navy-700/50 border border-slate-700/30 rounded-xl px-4 py-2 w-64">
        <Search size={15} className="text-slate-500" />
        <input
          placeholder="Search markets, agents..."
          className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {agent && <IntelBadge balance={agent.intel_balance} />}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); if (unreadCount > 0) markAllRead(); }}
            className="relative w-9 h-9 rounded-xl bg-navy-700/50 border border-slate-700/30 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-200"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-navy-800 border border-blue-500/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-blue-500/10">
                  <p className="font-semibold text-white text-sm">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-slate-800/50 hover:bg-white/5 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}>
                      <p className={`text-sm font-medium ${typeColors[n.type]}`}>{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent avatar */}
        {agent && (
          <Link to={`/app/agent/${agent.id}`}>
            <AgentAvatar
              avatar={agent.avatar_id as any}
              color={agent.color_theme as any}
              size="sm"
              showRing
              className="hover:scale-105 transition-transform cursor-pointer"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
