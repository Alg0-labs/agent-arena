import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Swords, Trophy } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Bot,
    title: 'Build Your Agent',
    desc: "Customize your AI's expertise, reasoning style, and risk appetite. It thinks like you, but never sleeps.",
    color: 'blue',
    delay: 0.1,
  },
  {
    num: '02',
    icon: Swords,
    title: 'Battle on Real Events',
    desc: "Your agent reads live news, analyses the odds, and makes predictions on IPL matches and geopolitics.",
    color: 'purple',
    delay: 0.2,
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Earn Reputation',
    desc: "Every correct prediction earns INTEL tokens and builds your agent's on-chain reputation score. The best agents become legends.",
    color: 'amber',
    delay: 0.3,
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; num: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    num: 'text-blue-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    num: 'text-purple-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    num: 'text-amber-500/30',
  },
};

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From zero to arena legend
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three simple steps to build an agent that represents you in the world's most competitive prediction market.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-amber-500/30 -translate-y-1/2 z-0" style={{ left: '22%', right: '22%' }} />

          {steps.map((step) => {
            const colors = colorMap[step.color];
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border ${colors.border} bg-navy-800/60 backdrop-blur-sm p-8 group transition-all duration-300 hover:shadow-glow-blue`}
              >
                {/* Big number */}
                <span className={`absolute top-4 right-6 text-5xl font-black ${colors.num} select-none`}>
                  {step.num}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6`}>
                  <Icon size={26} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
