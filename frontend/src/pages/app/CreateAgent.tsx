import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Edit3, Shield, Zap } from 'lucide-react';
import { AgentWizard } from '../../components/agent/AgentWizard';
import { AgentAvatar } from '../../components/ui/AgentAvatar';
import { useAuthStore } from '../../stores/authStore';
import { IntelBadge } from '../../components/ui/IntelBadge';
import type { AvatarType, ColorType } from '../../components/ui/AgentAvatar';

export const CreateAgent: React.FC = () => {
  const { agent, user } = useAuthStore();

  if (agent) {
    const riskNorm = agent.risk_profile / 100;
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">My Agent</h1>
          <p className="text-slate-400 text-sm mt-1">Your active agent in the arena</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-500/20 bg-navy-800/60 p-8 mb-6"
        >
          <div className="flex items-start gap-6 mb-6">
            <AgentAvatar avatar={agent.avatar_id as AvatarType} color={agent.color_theme as ColorType} size="xl" showRing />
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-1">{agent.name}</h2>
              <p className="text-slate-400 text-sm mb-3">@{user?.username}</p>
              <IntelBadge balance={agent.intel_balance} />
            </div>
            <button className="w-9 h-9 rounded-xl bg-navy-700 border border-slate-700/30 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors">
              <Edit3 size={15} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Win Rate', value: `${agent.win_rate.toFixed(1)}%`, color: 'text-emerald-400' },
              { label: 'Predictions', value: agent.total_predictions, color: 'text-blue-400' },
              { label: 'Reputation', value: Math.round(agent.reputation_score), color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-navy-700/50 border border-slate-700/30 p-4 text-center">
                <p className={`text-xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              icon: Bot,
              title: 'Expertise',
              content: (
                <div className="flex flex-wrap gap-2">
                  {agent.domain_expertise.map((e) => (
                    <span key={e} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                      {e}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              icon: Zap,
              title: 'Reasoning Style',
              content: <span className="text-sm text-white font-medium capitalize">{agent.reasoning_style} Mind</span>,
            },
            {
              icon: Shield,
              title: 'Risk Profile',
              content: (
                <div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden mb-1.5 w-full max-w-xs">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${agent.risk_profile}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">
                    {riskNorm <= 0.35 ? 'Conservative' : riskNorm <= 0.65 ? 'Balanced' : 'Aggressive'}
                  </span>
                </div>
              ),
            },
          ].map(({ icon: Icon, title, content }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-blue-500/10 bg-navy-800/60 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-blue-400" />
                <p className="text-sm font-semibold text-slate-300">{title}</p>
              </div>
              {content}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-white mb-1">Create Your Agent</h1>
        <p className="text-slate-400 text-sm">Build the AI that represents you in the arena</p>
      </div>
      <AgentWizard />
    </div>
  );
};
