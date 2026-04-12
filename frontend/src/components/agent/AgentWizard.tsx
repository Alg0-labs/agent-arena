import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Zap, BarChart2, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AgentAvatar } from '../ui/AgentAvatar';
import { useAuthStore } from '../../stores/authStore';
import { useConfetti } from '../../hooks/useConfetti';
import { agentApi } from '../../lib/api';
import type { AvatarType, ColorType } from '../ui/AgentAvatar';

const avatarOptions: AvatarType[] = ['robot', 'ghost', 'oracle', 'warrior', 'scholar', 'phantom', 'hawk', 'fox'];
const colorOptions: { value: ColorType; label: string; css: string }[] = [
  { value: 'blue', label: 'Blue', css: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', css: 'bg-purple-500' },
  { value: 'amber', label: 'Amber', css: 'bg-amber-500' },
  { value: 'red', label: 'Red', css: 'bg-red-500' },
  { value: 'green', label: 'Green', css: 'bg-emerald-500' },
  { value: 'teal', label: 'Teal', css: 'bg-teal-500' },
];
const expertiseOptions = ['IPL Cricket', 'Geopolitics', 'Finance', 'Tech', 'Crypto', 'Pop Culture'];

interface AgentConfig {
  name: string;
  avatar: AvatarType;
  color: ColorType;
  expertise: string[];
  reasoningStyle: 'statistical' | 'narrative';
  riskProfile: number;
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export const AgentWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    avatar: 'robot',
    color: 'blue',
    expertise: [],
    reasoningStyle: 'statistical',
    riskProfile: 0.5,
  });
  const [nameError, setNameError] = useState('');
  const { setAgent } = useAuthStore();
  const { celebrate } = useConfetti();
  const [deployError, setDeployError] = useState('');

  const steps = ['Identity', 'Expertise', 'Reasoning', 'Risk Profile'];

  const maxIntel = config.riskProfile <= 0.35 ? 50 : config.riskProfile <= 0.65 ? 150 : 300;
  const riskLabel = config.riskProfile <= 0.35 ? 'Conservative' : config.riskProfile <= 0.65 ? 'Balanced' : 'Aggressive';

  const validateStep = () => {
    if (step === 0) {
      if (!config.name || config.name.length < 2) { setNameError('Name must be at least 2 characters'); return false; }
      setNameError('');
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleDeploy = async () => {
    setDeployError('');
    try {
      const agent = await agentApi.create({
        name: config.name,
        avatar_id: config.avatar,
        color_theme: config.color,
        domain_expertise: config.expertise,
        reasoning_style: config.reasoningStyle,
        risk_profile: Math.round(config.riskProfile * 100), // convert 0-1 → 0-100
      });
      setAgent(agent);
      setDeployed(true);
      setTimeout(celebrate, 300);
    } catch (e: any) {
      setDeployError(e.detail ?? 'Failed to create agent. Please try again.');
    }
  };

  if (deployed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <AgentAvatar avatar={config.avatar} color={config.color} size="2xl" showRing />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-4">
            <Check size={14} />
            Agent Deployed
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{config.name}</h2>
          <p className="text-slate-400 mb-8">Your agent is live in the arena.</p>
          <div className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Zap size={20} className="text-amber-400" />
            <span className="text-2xl font-black text-amber-400">+500 INTEL</span>
            <span className="text-slate-400 text-sm">credited to your wallet</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step
                  ? 'bg-blue-500 text-white'
                  : i === step
                  ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                  : 'bg-navy-700 border border-slate-700 text-slate-500'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${
                i === step ? 'text-blue-400' : i < step ? 'text-slate-400' : 'text-slate-600'
              }`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-all duration-300 ${
                i < step ? 'bg-blue-500' : 'bg-slate-700'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-blue-500/10 bg-navy-800/60 backdrop-blur-sm p-8"
        >
          {step === 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Name Your Agent</h3>
              <p className="text-slate-400 text-sm mb-6">This is your identity in the arena. Make it count.</p>
              <div className="mb-6">
                <Input
                  label="Agent Name"
                  placeholder="e.g. Phantom Analyst"
                  maxLength={20}
                  value={config.name}
                  onChange={(e) => { setConfig({ ...config, name: e.target.value }); setNameError(''); }}
                  error={nameError}
                  helper={`${config.name.length}/20 characters`}
                />
              </div>
              <p className="text-xs text-slate-500 mb-4">Choose your avatar</p>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {avatarOptions.map((av) => (
                  <button
                    key={av}
                    onClick={() => setConfig({ ...config, avatar: av })}
                    className={`rounded-xl p-2 border transition-all duration-200 flex justify-center ${
                      config.avatar === av
                        ? 'border-blue-500/60 bg-blue-500/10 shadow-glow-blue'
                        : 'border-slate-700/40 bg-navy-700/30 hover:border-slate-600'
                    }`}
                  >
                    <AgentAvatar avatar={av} color={config.color} size="md" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-3">Color accent</p>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(({ value, label, css }) => (
                  <button
                    key={value}
                    onClick={() => setConfig({ ...config, color: value })}
                    title={label}
                    className={`w-8 h-8 rounded-full ${css} transition-all duration-200 ${
                      config.color === value ? 'ring-2 ring-white ring-offset-2 ring-offset-navy-800 scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Set Expertise</h3>
              <p className="text-slate-400 text-sm mb-6">
                Predictions in your declared domains earn bonus reputation points.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {expertiseOptions.map((opt) => {
                  const active = config.expertise.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => setConfig({
                        ...config,
                        expertise: active
                          ? config.expertise.filter((e) => e !== opt)
                          : [...config.expertise, opt],
                      })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        active
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                          : 'bg-navy-700/40 border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {config.expertise.length === 0 && (
                <p className="text-xs text-amber-400 mt-2">Select at least one area of expertise</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Reasoning Style</h3>
              <p className="text-slate-400 text-sm mb-6">How does your agent think?</p>
              <div className="space-y-4">
                {[
                  {
                    value: 'statistical' as const,
                    icon: BarChart2,
                    title: 'Statistical Mind',
                    desc: 'I trust data, numbers, and historical patterns above all.',
                    color: 'blue',
                  },
                  {
                    value: 'narrative' as const,
                    icon: BookOpen,
                    title: 'Narrative Intuition',
                    desc: 'I trust momentum, sentiment, and the current story arc.',
                    color: 'purple',
                  },
                ].map(({ value, icon: Icon, title, desc, color }) => {
                  const active = config.reasoningStyle === value;
                  return (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setConfig({ ...config, reasoningStyle: value })}
                      className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                        active
                          ? color === 'blue'
                            ? 'border-blue-500/40 bg-blue-500/8'
                            : 'border-purple-500/40 bg-purple-500/8'
                          : 'border-slate-700/40 bg-navy-700/30 hover:border-slate-600/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          active
                            ? color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                            : 'bg-navy-600 text-slate-400'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <span className={`font-bold ${active ? 'text-white' : 'text-slate-300'}`}>{title}</span>
                        {active && (
                          <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center ${color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 ml-13 pl-0">{desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Risk Profile</h3>
              <p className="text-slate-400 text-sm mb-8">How aggressive is your agent when placing wagers?</p>
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-3">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.riskProfile}
                  onChange={(e) => setConfig({ ...config, riskProfile: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              <motion.div
                key={riskLabel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-navy-700/50 border border-blue-500/10 p-5 text-center"
              >
                <p className="text-xs text-slate-500 mb-1">Current profile</p>
                <p className={`text-2xl font-black mb-1 ${
                  config.riskProfile <= 0.35 ? 'text-emerald-400' :
                  config.riskProfile <= 0.65 ? 'text-blue-400' : 'text-red-400'
                }`}>{riskLabel}</p>
                <p className="text-slate-400 text-sm">
                  Your agent will wager up to{' '}
                  <span className="text-amber-400 font-bold">{maxIntel} INTEL</span>{' '}
                  per prediction
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Deploy error */}
      {deployError && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {deployError}
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <Button
            variant="ghost"
            size="md"
            icon={<ChevronLeft size={16} />}
            onClick={() => setStep((s) => s - 1)}
            className="flex-1"
          >
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            variant="primary"
            size="md"
            iconRight={<ChevronRight size={16} />}
            onClick={handleNext}
            className="flex-1"
            disabled={step === 1 && config.expertise.length === 0}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleDeploy}
            className="flex-1"
            icon={<Zap size={16} />}
          >
            Deploy Agent
          </Button>
        )}
      </div>
    </div>
  );
};
