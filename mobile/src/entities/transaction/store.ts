import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Transaction, transactionSchema } from './model';

type State = {
  transactions: Transaction[];
  budget: number;
  /** 복원 전 렌더에서 빈 화면이 깜빡이지 않도록. */
  hydrated: boolean;
};

type Actions = {
  add: (t: Omit<Transaction, 'id'>) => void;
  remove: (id: string) => void;
  setBudget: (n: number) => void;
};

let seq = 0;

function nextId(): string {
  seq += 1;

  return `${Date.now().toString(36)}-${seq}`;
}

export const useLedger = create<State & Actions>()(
  persist(
    (set) => ({
      transactions: [],
      budget: 1_200_000,
      hydrated: false,

      add: (input) =>
        set((s) => ({
          transactions: [transactionSchema.parse({ ...input, id: nextId() }), ...s.transactions],
        })),

      remove: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      setBudget: (budget) => set({ budget }),
    }),
    {
      name: 'moneyminder.ledger.v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ transactions, budget }) => ({ transactions, budget }),
      onRehydrateStorage: () => () => useLedger.setState({ hydrated: true }),
    },
  ),
);
