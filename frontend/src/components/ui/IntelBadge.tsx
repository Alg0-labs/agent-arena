import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';

interface IntelBadgeProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const IntelBadge: React.FC<IntelBadgeProps> = ({
  balance,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const [displayed, setDisplayed] = useState(balance);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (balance !== displayed) {
      setFlash(balance > displayed ? 'up' : 'down');
      const timer = setTimeout(() => {
        setDisplayed(balance);
        setFlash(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [balance, displayed]);

  const sizes = {
    sm: { text: 'text-xs', icon: 12, px: 'px-2 py-1' },
    md: { text: 'text-sm', icon: 14, px: 'px-3 py-1.5' },
    lg: { text: 'text-base', icon: 16, px: 'px-4 py-2' },
  };

  const s = sizes[size];

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 ${s.px} ${className || ''}`}
      animate={flash ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <Coins
          size={s.icon}
          className={`${flash === 'up' ? 'text-green-400' : flash === 'down' ? 'text-red-400' : 'text-amber-400'} transition-colors duration-300`}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={balance}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`font-bold ${s.text} ${
            flash === 'up'
              ? 'text-green-400'
              : flash === 'down'
              ? 'text-red-400'
              : 'text-amber-400'
          } transition-colors duration-300`}
        >
          {balance.toLocaleString()}
        </motion.span>
      </AnimatePresence>
      <span className={`${s.text} text-amber-500/60 font-medium`}>INTEL</span>
    </motion.div>
  );
};
