import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Swords, Bot, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/app/feed', icon: Home, label: 'Feed' },
  { to: '/app/markets', icon: BarChart2, label: 'Markets' },
  { to: '/app/battles', icon: Swords, label: 'Battles' },
  { to: '/app/create-agent', icon: Bot, label: 'Agent' },
  { to: '/app/leaderboard', icon: Trophy, label: 'Ranks' },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden mobile-bottom-nav flex items-center justify-around px-2 py-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0',
              isActive
                ? 'text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                isActive ? 'bg-blue-500/15' : ''
              )}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
