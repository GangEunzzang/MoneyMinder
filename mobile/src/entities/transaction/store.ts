import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

import { type Transaction, transactionSchema } from './model';

type State = {
  transactions: Transaction[];
  budget: number;
  /**
   * 카테고리별 예산. 합이 총예산과 같을 필요는 없다 —
   * 일부만 정해두고 나머지는 총예산으로 관리하는 사람이 있다.
   */
  categoryBudgets: Record<string, number>;
  /** 복원 전 렌더에서 빈 화면이 깜빡이지 않도록. */
  hydrated: boolean;
};

type Actions = {
  add: (t: Omit<Transaction, 'id'>) => void;
  update: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void;
  remove: (id: string) => void;
  setBudget: (n: number) => void;
  setCategoryBudget: (categoryId: string, amount: number) => void;
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
      categoryBudgets: {},
      hydrated: false,

      add: (input) =>
        set((s) => ({
          transactions: [transactionSchema.parse({ ...input, id: nextId() }), ...s.transactions],
        })),

      update: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? transactionSchema.parse({ ...t, ...patch }) : t,
          ),
        })),

      remove: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      setBudget: (budget) => set({ budget }),

      setCategoryBudget: (categoryId, amount) =>
        set((s) => {
          const next = { ...s.categoryBudgets };
          // 0 은 "예산 없음"이다. 0원 예산을 둔 채로 두면 항상 초과로 보인다.
          if (amount > 0) next[categoryId] = amount;
          else delete next[categoryId];

          return { categoryBudgets: next };
        }),
    }),
    {
      name: 'moneyminder.ledger.v2',
      storage: persistStorage,
      partialize: ({ transactions, budget, categoryBudgets }) => ({
        transactions,
        budget,
        categoryBudgets,
      }),
      onRehydrateStorage: () => () => useLedger.setState({ hydrated: true }),
    },
  ),
);
