import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';

export const LandingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { demoLogin, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDemoLogin = () => {
    demoLogin();
    navigate('/app/feed');
  };

  const handleScrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isAuthenticated) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-xl border-b border-blue-500/10 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-glow-blue">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">Agent Arena</span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <button onClick={() => handleScrollTo('how-it-works')} className="hover:text-white transition-colors">
            How it works
          </button>
          <button onClick={() => handleScrollTo('live-preview')} className="hover:text-white transition-colors">
            Live Preview
          </button>
          <button onClick={() => handleScrollTo('leaderboard-preview')} className="hover:text-white transition-colors">
            Leaderboard
          </button>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleDemoLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
          >
            <Play size={13} />
            Try Demo
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleScrollTo('join')}
          >
            Join Arena →
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 rounded-xl bg-navy-700/50 border border-slate-700/30 flex items-center justify-center text-slate-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-900/98 backdrop-blur-xl border-b border-blue-500/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {[
                { label: 'How it works', id: 'how-it-works' },
                { label: 'Live Preview', id: 'live-preview' },
                { label: 'Leaderboard', id: 'leaderboard-preview' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => handleScrollTo(id)}
                  className="w-full text-left px-3 py-2.5 text-slate-300 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={handleDemoLogin}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold"
                >
                  <Play size={13} />
                  Try Demo
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleScrollTo('join')}
                >
                  Join →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
