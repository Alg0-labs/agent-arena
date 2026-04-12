import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Flame, Link2, CheckCircle2, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import { useIntelStore } from '../../stores/intelStore';
import { useCountUp } from '../../hooks/useCountUp';

const typeColors: Record<string, string> = {
  WIN: 'text-emerald-400',
  LOSS: 'text-red-400',
  STREAK: 'text-amber-400',
  WAGER: 'text-slate-400',
  SIGNUP: 'text-blue-400',
};

const typeIcons: Record<string, React.ReactNode> = {
  WIN: <TrendingUp size={14} />,
  LOSS: <TrendingDown size={14} />,
  STREAK: <Flame size={14} />,
  WAGER: <Coins size={14} />,
  SIGNUP: <Zap size={14} />,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-navy-700 border border-blue-500/20 rounded-xl px-3 py-2 text-xs">
        <p className="text-slate-400">{label}</p>
        <p className="text-amber-400 font-bold">+{payload[0].value} INTEL</p>
      </div>
    );
  }
  return null;
};

export const Wallet: React.FC = () => {
  const { user } = useAuthStore();
  const { transactions } = useIntelStore();
  const balance = useCountUp(user?.intelBalance || 0, 1200);

  const loginStreak = user?.loginStreak || 7;
  const streakDays = Array.from({ length: 10 }, (_, i) => i < loginStreak);

  const earningChecklist = [
    { label: '7-day login streak', done: loginStreak >= 7, bonus: '+100 INTEL' },
    { label: 'First battle completed', done: true, bonus: '+50 INTEL' },
    { label: 'First win', done: true, bonus: '+200 INTEL' },
    { label: 'Invite a friend', done: false, bonus: '+250 INTEL' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Coins size={24} className="text-amber-400" />
          INTEL Wallet
        </h1>
        <p className="text-slate-400 text-sm mt-1">Your virtual currency balance and earnings</p>
      </div>

      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-navy-800/80 p-8 mb-6 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Coins size={28} className="text-amber-400" />
          </div>
          <p className="text-slate-400 text-sm mb-2">Current Balance</p>
          <p className="text-6xl font-black text-amber-400">
            {Math.floor(balance).toLocaleString()}
          </p>
          <p className="text-amber-600 font-semibold mt-1">INTEL</p>
          <p className="text-xs text-slate-600 mt-4">INTEL tokens have no real-world monetary value</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-blue-500/10 bg-navy-800/60 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-amber-400" />
            <p className="font-semibold text-white">Login Streak</p>
            <span className="ml-auto text-amber-400 font-black">{loginStreak} days</span>
          </div>
          <div className="flex gap-1.5 mb-4">
            {streakDays.map((done, i) => (
              <div
                key={i}
                className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-navy-700 text-slate-700 border border-slate-700/30'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">3 more days → <span className="text-amber-400">+200 INTEL bonus</span></p>
        </motion.div>

        {/* Earn checklist */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-blue-500/10 bg-navy-800/60 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-blue-400" />
            <p className="font-semibold text-white">Earn More INTEL</p>
          </div>
          <div className="space-y-3">
            {earningChecklist.map(({ label, done, bonus }) => (
              <div key={label} className="flex items-center gap-3">
                <CheckCircle2
                  size={16}
                  className={done ? 'text-emerald-400' : 'text-slate-600'}
                />
                <span className={`text-sm flex-1 ${done ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                  {label}
                </span>
                <span className="text-xs text-amber-400 font-medium">{bonus}</span>
              </div>
            ))}
          </div>

          {/* Invite link */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-700/50 border border-slate-700/30">
            <Link2 size={13} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 truncate flex-1">agentarena.io/ref/cryptosage</span>
            <button className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors">
              Copy
            </button>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-blue-500/10 bg-navy-800/60 p-5 mb-6"
      >
        <h3 className="font-semibold text-white mb-4">INTEL Earned (Last 14 Days)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...useIntelStore.getState().history]} margin={{ left: -20 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
              <Bar dataKey="earned" radius={[4, 4, 0, 0]}>
                {useIntelStore.getState().history.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.earned > 0 ? '#F59E0B' : '#1e2d4a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-blue-500/10 bg-navy-800/60 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-800/50">
          <h3 className="font-semibold text-white">Transaction History</h3>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[80px_1fr_80px_90px] gap-3 px-5 py-3 bg-navy-900/30 text-xs text-slate-500 uppercase tracking-widest font-semibold border-b border-slate-800/30">
          <span>Date</span>
          <span>Description</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Balance</span>
        </div>

        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[80px_1fr_80px_90px] gap-3 px-5 py-3.5 border-b border-slate-800/30 hover:bg-white/3 transition-colors items-center"
          >
            <span className="text-xs text-slate-500">{tx.date.slice(5)}</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className={typeColors[tx.type]}>{typeIcons[tx.type]}</span>
              <span className="text-sm text-slate-300 truncate">{tx.description}</span>
            </div>
            <span className={`text-sm font-bold text-right ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
            </span>
            <span className="text-sm text-slate-400 text-right font-medium">{tx.balance.toLocaleString()}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
