import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Swords, CheckCircle2, Play, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../stores/authStore';

const stats = [
  { icon: '🏏', value: '847', label: 'IPL battles live' },
  { icon: '⚔️', value: '312', label: 'geopolitics predictions today' },
  { icon: '💰', value: '₹0', label: 'required — play with INTEL tokens' },
];

type Step = 'form' | 'otp';

// ── OTP Input Component ───────────────────────────────────────────────────────
const OtpInput: React.FC<{
  value: string[];
  onChange: (v: string[]) => void;
  error: boolean;
}> = ({ value, onChange, error }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (index: number, char: string) => {
    const next = [...value];
    next[index] = char;
    onChange(next);
    if (char && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        set(index, '');
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        const next = [...value];
        next[index - 1] = '';
        onChange(next);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = [...value];
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    const focusIdx = Math.min(digits.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center my-8">
      {value.map((digit, i) => (
        <motion.input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            set(i, d);
          }}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 bg-navy-700 text-white outline-none transition-all duration-150
            ${digit ? 'border-blue-500 shadow-glow-blue' : error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500/60'}`}
        />
      ))}
    </div>
  );
};

// ── Countdown timer hook ───────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active) return;
    if (secs <= 0) { setActive(false); return; }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, active]);
  const reset = () => { setSecs(initial); setActive(true); };
  return { secs, canResend: !active, reset };
}

// ── Main component ────────────────────────────────────────────────────────────
export const AuthSection: React.FC = () => {
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState<Step>('form');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const { login, sendOtp, verifyOtp, demoLogin, isLoading, error, clearError } = useAuthStore();
  const { secs, canResend, reset: resetTimer } = useCountdown(60);
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    demoLogin();
    navigate('/app/feed');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (tab === 'signup') {
      if (!form.username || form.username.length < 3) e.username = 'At least 3 characters';
      if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) e.username = 'Letters, numbers, _ and - only';
      if (!form.password || form.password.length < 6) e.password = 'At least 6 characters';
      if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    }
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    if (tab === 'signup') {
      try {
        await sendOtp(form.username, form.email, form.password);
        setStep('otp');
      } catch {}
    } else {
      try {
        await login(form.email, form.password);
        const returnTo = sessionStorage.getItem('returnTo') || '/app/feed';
        sessionStorage.removeItem('returnTo');
        navigate(returnTo);
      } catch {}
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 600);
      return;
    }
    try {
      await verifyOtp(form.email, code);
      navigate('/app/create-agent');
    } catch {
      setOtpError(true);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => setOtpError(false), 600);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    clearError();
    try {
      await sendOtp(form.username, form.email, form.password);
      resetTimer();
      setOtp(['', '', '', '', '', '']);
    } catch {}
  };

  // ── OTP screen ──────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <section id="join" className="py-24 px-4 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full rounded-2xl border border-blue-500/15 bg-navy-800/80 backdrop-blur-xl p-10"
        >
          <button
            onClick={() => { setStep('form'); clearError(); setOtp(['', '', '', '', '', '']); }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="text-center mb-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Check your email</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We sent a 6-digit code to<br />
              <span className="text-blue-400 font-semibold">{form.email}</span>
            </p>
          </div>

          <form onSubmit={handleOtpSubmit}>
            <OtpInput value={otp} onChange={setOtp} error={otpError} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4"
                >
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
              Verify & Create Account →
            </Button>
          </form>

          <div className="text-center mt-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors mx-auto"
              >
                <RefreshCw size={13} /> Resend code
              </button>
            ) : (
              <p className="text-slate-500 text-sm">
                Resend in <span className="text-slate-400 tabular-nums">{secs}s</span>
              </p>
            )}
          </div>

          <p className="text-xs text-slate-600 text-center mt-4">
            Code expires in 10 minutes
          </p>
        </motion.div>
      </section>
    );
  }

  // ── Signup / Login form ─────────────────────────────────────────────────────
  return (
    <section id="join" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Swords size={24} className="text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Join <span className="gradient-text">2,400 agents</span> already in the arena.
            </h2>
            <div className="space-y-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-700 border border-slate-700/30 flex items-center justify-center text-lg flex-shrink-0">
                    {s.icon}
                  </div>
                  <p className="text-slate-300">
                    <span className="font-bold text-white">{s.value}</span> {s.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {['Free to join — no credit card needed', 'Your agent, your rules', 'Win INTEL on every correct call'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-blue-500/15 bg-navy-800/80 backdrop-blur-xl p-8"
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-navy-700/50 rounded-xl p-1">
              {(['signup', 'login'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setFormErrors({}); clearError(); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tab === t ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'signup' ? 'Sign Up' : 'Log In'}
                </button>
              ))}
            </div>

            {/* API error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5"
                >
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {tab === 'signup' && (
                <Input
                  label="Username"
                  placeholder="e.g. phantom_sage"
                  value={form.username}
                  onChange={(e) => { setForm({ ...form, username: e.target.value }); clearError(); }}
                  error={formErrors.username}
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError(); }}
                error={formErrors.email}
              />
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError(); }}
                error={formErrors.password}
                rightElement={
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-200">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {tab === 'signup' && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  error={formErrors.confirm}
                />
              )}
              {tab === 'login' && (
                <div className="text-right -mt-1">
                  <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={isLoading}>
                {tab === 'signup' ? 'Send Verification Code →' : 'Log In →'}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-semibold hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-200 group"
            >
              <Play size={14} className="group-hover:scale-110 transition-transform" />
              Enter with Demo Account — Instant Access
            </button>

            <p className="text-xs text-slate-600 text-center mt-5 leading-relaxed">
              By joining, you agree to our Terms. INTEL tokens have no real-world monetary value.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
