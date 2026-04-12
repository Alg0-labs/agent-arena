import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Bot, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useTypewriter } from '../../hooks/useTypewriter';

interface Market {
  id: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  timeRemaining: string;
  category: string;
  categoryEmoji: string;
  closingSoon: boolean;
}

const mockReasoning: Record<string, string> = {
  default: "Based on current market signals and available intelligence, my analysis indicates a moderate probability shift. Key factors include recent news momentum, historical patterns at this junction, and crowd sentiment diverging from my baseline model. Statistical confidence interval suggests the YES position carries slightly higher expected value given current pricing inefficiencies.",
};

export const MarketCard: React.FC<{ market: Market }> = ({ market }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [reasoningText, setReasoningText] = useState('');

  const { displayed, isDone } = useTypewriter(reasoningText, 15, showReasoning && reasoningText.length > 0);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setShowReasoning(false);
    setReasoningText('');
    await new Promise((r) => setTimeout(r, 1400));
    setReasoningText(mockReasoning.default);
    setAnalyzing(false);
    setShowReasoning(true);
  };

  const yesColor = market.yesPrice >= 0.6 ? 'text-emerald-400' : market.yesPrice <= 0.4 ? 'text-red-400' : 'text-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-blue-500/10 bg-navy-800/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-blue-500/25 hover:shadow-[0_0_25px_rgba(59,130,246,0.06)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-2 flex-1">
          <span>{market.categoryEmoji}</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-white leading-snug">{market.question}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={market.category === 'IPL 2025' ? 'blue' : 'red'} size="sm">
                {market.category}
              </Badge>
              {market.closingSoon && (
                <Badge variant="amber" size="sm">Closing Soon</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">YES</p>
          <p className={`text-lg font-bold ${yesColor}`}>{(market.yesPrice * 100).toFixed(0)}¢</p>
        </div>
        <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">NO</p>
          <p className="text-lg font-bold text-red-400">{(market.noPrice * 100).toFixed(0)}¢</p>
        </div>
        <div className="rounded-xl bg-navy-700/50 border border-slate-700/30 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Volume</p>
          <p className="text-sm font-bold text-slate-300">{market.volume}</p>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Clock size={12} />
        <span>{market.timeRemaining} remaining</span>
        <span className="text-slate-700 mx-1">·</span>
        <TrendingUp size={12} />
        <span>High volume</span>
      </div>

      {/* Analyze button */}
      <Button
        variant="secondary"
        size="sm"
        className="w-full mb-3"
        loading={analyzing}
        icon={!analyzing ? <Bot size={14} /> : undefined}
        onClick={handleAnalyze}
      >
        {analyzing ? 'Analyzing...' : 'Let My Agent Analyze This'}
      </Button>

      {/* Reasoning stream */}
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                  <Bot size={12} />
                  Agent Reasoning
                </p>
                <button
                  onClick={() => setShowReasoning(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <p className={`text-xs text-slate-300 leading-relaxed ${!isDone ? 'typewriter-cursor' : ''}`}>
                {displayed}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
