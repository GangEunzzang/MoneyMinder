import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

import type { Recurring } from './model';

const SEED: Recurring[] = [
  {
    id: 'netflix',
    name: '넷플릭스',
    amount: 17_000,
    cycleDay: 5,
    categoryId: 'subscription',
    paymentMethodId: 'shinhan',
    autoRecord: true,
    remindBeforeDays: 3,
    lastRecordedMonth: null,
  },
  {
    id: 'skt',
    name: 'SKT 통신비',
    amount: 55_000,
    cycleDay: 25,
    categoryId: 'telecom',
    paymentMethodId: 'kb',
    autoRecord: true,
    remindBeforeDays: 3,
    lastRecordedMonth: null,
  },
  {
    id: 'gym',
    name: '헬스장',
    amount: 99_000,
    cycleDay: 1,
    categoryId: 'etc',
    paymentMethodId: 'kakao',
    autoRecord: false,
    remindBeforeDays: 3,
    lastRecordedMonth: null,
  },
];

type State = { items: Recurring[] };

type Actions = {
  add: (r: Recurring) => void;
  update: (id: string, patch: Partial<Recurring>) => void;
  remove: (id: string) => void;
  /** 자동기록 완료 표시. 이 달 도장을 찍어야 다음 실행에서 건너뛴다. */
  markRecorded: (id: string, ym: string) => void;
};

export const useRecurring = create<State & Actions>()(
  persist(
    (set) => ({
      items: SEED,
      add: (r) => set((s) => ({ items: [...s.items, r] })),
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((r) => r.id !== id) })),
      markRecorded: (id, ym) =>
        set((s) => ({
          items: s.items.map((r) => (r.id === id ? { ...r, lastRecordedMonth: ym } : r)),
        })),
    }),
    { name: 'moneyminder.recurring.v1', storage: persistStorage },
  ),
);
