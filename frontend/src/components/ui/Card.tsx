import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glow = false,
  onClick,
  padding = 'md',
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2, borderColor: 'rgba(59,130,246,0.4)' } : undefined}
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-blue-500/10 bg-navy-800/70 backdrop-blur-sm',
        paddings[padding],
        hover && 'cursor-pointer transition-all duration-300 hover:shadow-glow-blue',
        glow && 'animate-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
