import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, ThumbsUp } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AgentAvatar } from '../../components/ui/AgentAvatar';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useBattlesStore } from '../../stores/battlesStore';
import { mockBattles } from '../../data/mockData';

const emojis = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😬', label: 'Nervous' },
  { emoji: '💀', label: 'Dead' },
  { emoji: '🤯', label: 'Mindblown' },
];

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const { displayed, isDone } = useTypewriter(text, 14);
  return (
    <p className={`text-sm text-slate-300 leading-relaxed ${!isDone ? 'typewriter-cursor' : ''}`}>
      {displayed}
    </p>
  );
};

export const BattlePage: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const battle = mockBattles.find((b) => b.id === battleId) || mockBattles[0];
  const { userVotes, voteOnBattle, addReaction } = useBattlesStore();
  const [localReactions, setLocalReactions] = useState<Record<string, number>>({});

  const userVote = userVotes[battle.id];
  const hasVoted = !!userVote;

  const handleReaction = (emoji: string) => {
    addReaction(battle.id, emoji);
    setLocalReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
  };

  const reactionCounts: Record<string, number> = {
    '🔥': (battle.reactions?.fire || 0) + (localReactions['🔥'] || 0),
    '😬': (battle.reactions?.nervous || 0) + (localReactions['😬'] || 0),
    '💀': (battle.reactions?.skull || 0) + (localReactions['💀'] || 0),
    '🤯': (battle.reactions?.mindblown || 0) + (localReactions['🤯'] || 0),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        to="/app/battles"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Battles
      </Link>

      {/* Category + status */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg">{battle.categoryEmoji}</span>
        <span className="text-slate-400 text-sm">{battle.category}</span>
        <Badge variant="live" pulse>LIVE</Badge>
        <div className="ml-auto flex items-center gap-1.5 text-slate-400 text-sm">
          <Clock size={14} />
          <span>{battle.timeRemaining}</span>
        </div>
      </div>

      {/* Question */}
      <h1 className="text-2xl md:text-3xl font-black text-white mb-8 leading-tight">
        {battle.question}
      </h1>

      {/* Agents */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
        {/* VS */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-12 h-12 rounded-full bg-navy-800 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm shadow-glow-blue">
            VS
          </div>
        </div>

        {/* Agent A */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AgentAvatar avatar={battle.agentA.avatar} color={battle.agentA.color} size="lg" showRing />
            <div>
              <p className="font-bold text-white text-lg">{battle.agentA.name}</p>
              <p className="text-sm text-slate-500">@{battle.agentA.owner}</p>
            </div>
            <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-xl ${
              battle.agentAPosition === 'YES'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }`}>
              {battle.agentAPosition}
            </span>
          </div>

          {/* Confidence */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Confidence</span>
              <span className="font-bold text-blue-400">{battle.agentAConfidence}%</span>
            </div>
            <div className="h-2.5 bg-navy-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battle.agentAConfidence}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
              />
            </div>
          </div>

          {/* Reasoning */}
          <div className="rounded-xl bg-navy-800/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">Agent Reasoning</p>
            <TypewriterText text={battle.agentAReasoning} />
          </div>
        </motion.div>

        {/* Agent B */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AgentAvatar avatar={battle.agentB.avatar} color={battle.agentB.color} size="lg" showRing />
            <div>
              <p className="font-bold text-white text-lg">{battle.agentB.name}</p>
              <p className="text-sm text-slate-500">@{battle.agentB.owner}</p>
            </div>
            <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-xl ${
              battle.agentBPosition === 'YES'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }`}>
              {battle.agentBPosition}
            </span>
          </div>

          {/* Confidence */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Confidence</span>
              <span className="font-bold text-purple-400">{battle.agentBConfidence}%</span>
            </div>
            <div className="h-2.5 bg-navy-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battle.agentBConfidence}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
              />
            </div>
          </div>

          {/* Reasoning */}
          <div className="rounded-xl bg-navy-800/60 p-4">
            <p className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Agent Reasoning</p>
            <TypewriterText text={battle.agentBReasoning} />
          </div>
        </motion.div>
      </div>

      {/* Crowd vote */}
      <div className="rounded-2xl border border-slate-700/30 bg-navy-800/60 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            Who's making the better case?
          </h3>
          <span className="text-sm text-slate-500">{battle.totalVotes.toLocaleString()} votes</span>
        </div>

        {!hasVoted ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              icon={<ThumbsUp size={14} />}
              onClick={() => voteOnBattle(battle.id, 'A')}
            >
              {battle.agentA.name}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              icon={<ThumbsUp size={14} />}
              onClick={() => voteOnBattle(battle.id, 'B')}
            >
              {battle.agentB.name}
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className={`font-semibold ${userVote === 'A' ? 'text-blue-400' : 'text-slate-400'}`}>
                  {battle.agentA.name} — {battle.crowdVoteA}%
                </span>
                <span className={`font-semibold ${userVote === 'B' ? 'text-purple-400' : 'text-slate-400'}`}>
                  {battle.crowdVoteB}% — {battle.agentB.name}
                </span>
              </div>
              <div className="h-4 bg-navy-700 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${battle.crowdVoteA}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-blue-500/70"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${battle.crowdVoteB}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-purple-500/70"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                You voted for{' '}
                <span className={userVote === 'A' ? 'text-blue-400 font-semibold' : 'text-purple-400 font-semibold'}>
                  {userVote === 'A' ? battle.agentA.name : battle.agentB.name}
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Reactions */}
      <div className="rounded-2xl border border-slate-700/30 bg-navy-800/60 p-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Reactions</p>
        <div className="flex gap-3">
          {emojis.map(({ emoji }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-700/50 border border-slate-700/30 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-sm font-bold text-slate-400">{reactionCounts[emoji] || 0}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
