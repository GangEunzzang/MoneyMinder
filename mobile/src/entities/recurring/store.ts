import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toServerCategoryCode } from '@/entities/category/serverCode';
import { api } from '@/shared/lib/api';
import { toServerId } from '@/shared/lib/serverId';
import { persistStorage } from '@/shared/lib/storage';

import type { Recurring } from './model';
import { toAppRecurring } from './serverAdapter';

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

function toServerInput(r: Recurring) {
  return {
    name: r.name,
    amount: r.amount,
    cycleDay: r.cycleDay,
    categoryCode: toServerCategoryCode(r.categoryId),
    paymentMethodId: r.paymentMethodId == null ? null : toServerId(r.paymentMethodId),
    autoRecord: r.autoRecord,
    remindBeforeDays: r.remindBeforeDays,
  };
}

export const useRecurring = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: SEED,

      add: (r) => {
        set((s) => ({ items: [...s.items, r] }));

        api.recurrings
          .create(toServerInput(r))
          .then((saved) =>
            set((s) => ({
              items: s.items.map((item) => (item.id === r.id ? toAppRecurring(saved) : item)),
            })),
          )
          .catch(() => undefined);
      },

      update: (id, patch) => {
        const next = { ...get().items.find((r) => r.id === id), ...patch } as Recurring;
        set((s) => ({ items: s.items.map((r) => (r.id === id ? next : r)) }));

        const serverId = toServerId(id);
        if (serverId) api.recurrings.update(serverId, toServerInput(next)).catch(() => undefined);
      },

      remove: (id) => {
        set((s) => ({ items: s.items.filter((r) => r.id !== id) }));

        const serverId = toServerId(id);
        if (serverId) api.recurrings.remove(serverId).catch(() => undefined);
      },

      /**
       * 자동기록 도장은 서버가 찍는다. 여기서는 화면만 맞춰두고,
       * 다음 동기화에서 서버 값이 진실이 된다.
       */
      markRecorded: (id, ym) =>
        set((s) => ({
          items: s.items.map((r) => (r.id === id ? { ...r, lastRecordedMonth: ym } : r)),
        })),
    }),
    { name: 'moneyminder.recurring.v1', storage: persistStorage },
  ),
);
