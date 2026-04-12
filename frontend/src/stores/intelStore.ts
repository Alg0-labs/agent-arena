import { create } from 'zustand';
import { mockTransactions, mockIntelHistory } from '../data/mockData';

interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  balance: number;
}

interface IntelStore {
  balance: number;
  transactions: Transaction[];
  history: { date: string; earned: number }[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

export const useIntelStore = create<IntelStore>((set) => ({
  balance: 5200,
  transactions: mockTransactions,
  history: mockIntelHistory,

  addTransaction: (tx) => {
    const newTx = { ...tx, id: `t${Date.now()}` };
    set((state) => ({
      balance: state.balance + tx.amount,
      transactions: [newTx, ...state.transactions],
    }));
  },
}));
