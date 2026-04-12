import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'red' | 'green' | 'purple' | 'teal' | 'gray' | 'live';
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'sm',
  className,
  pulse,
}) => {
  const variants = {
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    red: 'bg-red-500/15 text-red-400 border border-red-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    teal: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
    gray: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    live: 'bg-red-500 text-white border-0',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse-live',
        className
      )}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
      {children}
    </span>
  );
};
