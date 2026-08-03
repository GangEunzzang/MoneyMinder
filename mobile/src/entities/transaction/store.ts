import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toServerCategoryCode } from '@/entities/category/serverCode';
import { api } from '@/shared/lib/api';
import { toServerId } from '@/shared/lib/serverId';
import { persistStorage } from '@/shared/lib/storage';

import { type Transaction, transactionSchema } from './model';
import { toAppTransaction } from './serverAdapter';

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
  /** 서버가 발급한 예산 id. 두 번째 저장부터는 생성이 아니라 수정이다. */
  budgetIds: Record<string, number>;
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

function toServerInput(t: Transaction) {
  return {
    amount: t.amount,
    categoryCode: toServerCategoryCode(t.categoryId),
    transactionDate: t.date,
    memo: t.memo,
    merchant: t.merchant,
    paymentMethodId: t.paymentMethodId == null ? null : toServerId(t.paymentMethodId),
  };
}

/** 총액 예산은 카테고리가 없다. 서버도 categoryCode 를 비워 받는다. */
const TOTAL_BUDGET_KEY = '__total__';

export const useLedger = create<State & Actions>()(
  persist(
    (set, get) => ({
      transactions: [],
      budget: 1_200_000,
      categoryBudgets: {},
      budgetIds: {},
      hydrated: false,

      add: (input) => {
        const local = transactionSchema.parse({ ...input, id: nextId() });
        set((s) => ({ transactions: [local, ...s.transactions] }));

        // 화면은 이미 그려졌다. 서버 응답이 오면 id 만 서버 것으로 바꾼다.
        api.transactions
          .create(toServerInput(local))
          .then((saved) =>
            set((s) => ({
              transactions: s.transactions.map((t) =>
                t.id === local.id ? toAppTransaction(saved) : t,
              ),
            })),
          )
          .catch(() => undefined);
      },

      update: (id, patch) => {
        const next = transactionSchema.parse({
          ...get().transactions.find((t) => t.id === id),
          ...patch,
        });

        set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? next : t)) }));

        const serverId = toServerId(id);
        if (serverId) api.transactions.update(serverId, toServerInput(next)).catch(() => undefined);
      },

      remove: (id) => {
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));

        const serverId = toServerId(id);
        if (serverId) api.transactions.remove(serverId).catch(() => undefined);
      },

      setBudget: (budget) => {
        set({ budget });
        saveBudget(get, set, TOTAL_BUDGET_KEY, null, budget);
      },

      setCategoryBudget: (categoryId, amount) => {
        set((s) => {
          const next = { ...s.categoryBudgets };
          // 0 은 "예산 없음"이다. 0원 예산을 둔 채로 두면 항상 초과로 보인다.
          if (amount > 0) next[categoryId] = amount;
          else delete next[categoryId];

          return { categoryBudgets: next };
        });

        if (amount > 0) {
          saveBudget(get, set, categoryId, toServerCategoryCode(categoryId), amount);
        }
      },
    }),
    {
      name: 'moneyminder.ledger.v2',
      storage: persistStorage,
      partialize: ({ transactions, budget, categoryBudgets, budgetIds }) => ({
        transactions,
        budget,
        categoryBudgets,
        budgetIds,
      }),
      onRehydrateStorage: () => () => useLedger.setState({ hydrated: true }),
    },
  ),
);

/** 서버 예산은 달마다 한 행이라 처음은 생성, 다음부터는 수정이다. */
function saveBudget(
  get: () => State & Actions,
  set: (partial: Partial<State>) => void,
  key: string,
  categoryCode: string | null,
  amount: number,
): void {
  const now = new Date();
  const existing = get().budgetIds[key];

  const request = existing
    ? api.budgets.update(existing, amount)
    : api.budgets.create(now.getFullYear(), now.getMonth() + 1, amount, categoryCode);

  request
    .then((saved) => set({ budgetIds: { ...get().budgetIds, [key]: saved.budgetId } }))
    .catch(() => undefined);
}
