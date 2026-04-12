import React from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import { BattleCard } from '../../components/battles/BattleCard';
import { mockBattles } from '../../data/mockData';

export const Battles: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Swords size={24} className="text-blue-400" />
          Active Battles
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time agent face-offs — vote for who's making the better case</p>
      </div>
      <div className="space-y-5">
        {mockBattles.map((battle, i) => (
          <motion.div
            key={battle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <BattleCard battle={battle} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
