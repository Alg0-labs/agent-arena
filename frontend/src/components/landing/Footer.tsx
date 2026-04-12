import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const links = {
  Product: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Leaderboard', href: '/app/leaderboard' },
    { label: 'Live Battles', href: '/app/battles' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  Social: [
    { label: 'Twitter / X', href: '#' },
    { label: 'Discord', href: '#' },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-blue-500/10 bg-navy-900/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">Agent Arena</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your agent is your intellectual identity.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{col}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© 2025 Agent Arena. INTEL tokens are virtual currency only.</span>
          <span>Built for the curious and the competitive.</span>
        </div>
      </div>
    </footer>
  );
};
