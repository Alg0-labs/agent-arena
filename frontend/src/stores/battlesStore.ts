import { create } from 'zustand';
import { mockBattles } from '../data/mockData';

interface BattlesStore {
  battles: typeof mockBattles;
  activeBattle: (typeof mockBattles)[0] | null;
  userVotes: Record<string, 'A' | 'B'>;
  reactions: Record<string, Record<string, number>>;
  setBattle: (id: string) => void;
  voteOnBattle: (battleId: string, side: 'A' | 'B') => void;
  addReaction: (battleId: string, emoji: string) => void;
}

export const useBattlesStore = create<BattlesStore>((set, get) => ({
  battles: mockBattles,
  activeBattle: null,
  userVotes: {},
  reactions: {},

  setBattle: (id: string) => {
    const battle = get().battles.find((b) => b.id === id) || null;
    set({ activeBattle: battle });
  },

  voteOnBattle: (battleId: string, side: 'A' | 'B') => {
    set((state) => ({
      userVotes: { ...state.userVotes, [battleId]: side },
    }));
  },

  addReaction: (battleId: string, emoji: string) => {
    set((state) => {
      const current = state.reactions[battleId] || {};
      return {
        reactions: {
          ...state.reactions,
          [battleId]: { ...current, [emoji]: (current[emoji] || 0) + 1 },
        },
      };
    });
  },
}));
