import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { api } from '@/shared/lib/api';
import { toServerId } from '@/shared/lib/serverId';
import { persistStorage } from '@/shared/lib/storage';

import type { PaymentMethod } from './model';
import { toAppPaymentMethod } from './serverAdapter';

/** 첫 실행 시드. 빈 목록으로 시작하면 기록 화면에서 고를 게 없다. */
const SEED: PaymentMethod[] = [
  { id: 'shinhan', name: '신한체크', kind: 'card', color: 'violet', billingDay: null },
  { id: 'kb', name: '국민카드', kind: 'card', color: 'violetDeep', billingDay: 25 },
  { id: 'kakao', name: '카카오뱅크', kind: 'account', color: 'mint', billingDay: null },
  { id: 'cash', name: '현금', kind: 'cash', color: 'mist', billingDay: null },
];

type State = { methods: PaymentMethod[] };
type Actions = {
  add: (pm: PaymentMethod) => void;
  update: (id: string, patch: Partial<PaymentMethod>) => void;
  /** 내역은 남기고 연결만 끊는다 — 과거 기록이 사라지면 가계부가 망가진다. */
  remove: (id: string) => void;
};

function toServerInput(pm: PaymentMethod) {
  return {
    name: pm.name,
    kind: pm.kind.toUpperCase() as 'CARD' | 'CASH' | 'ACCOUNT',
    color: pm.color,
    // 결제일은 카드만 가질 수 있다. 서버가 다른 종류의 결제일을 거부한다.
    billingDay: pm.kind === 'card' ? pm.billingDay : null,
  };
}

export const usePaymentMethods = create<State & Actions>()(
  persist(
    (set, get) => ({
      methods: SEED,

      add: (pm) => {
        set((s) => ({ methods: [...s.methods, pm] }));

        api.paymentMethods
          .create(toServerInput(pm))
          .then((saved) =>
            set((s) => ({
              methods: s.methods.map((m) => (m.id === pm.id ? toAppPaymentMethod(saved) : m)),
            })),
          )
          .catch(() => undefined);
      },

      update: (id, patch) => {
        const next = { ...get().methods.find((m) => m.id === id), ...patch } as PaymentMethod;
        set((s) => ({ methods: s.methods.map((m) => (m.id === id ? next : m)) }));

        const serverId = toServerId(id);
        if (serverId) {
          api.paymentMethods.update(serverId, toServerInput(next)).catch(() => undefined);
        }
      },

      remove: (id) => {
        set((s) => ({ methods: s.methods.filter((m) => m.id !== id) }));

        const serverId = toServerId(id);
        if (serverId) api.paymentMethods.remove(serverId).catch(() => undefined);
      },
    }),
    { name: 'moneyminder.payment-methods.v1', storage: persistStorage },
  ),
);

export function usePaymentMethod(id: string | null): PaymentMethod | undefined {
  return usePaymentMethods((s) => (id ? s.methods.find((m) => m.id === id) : undefined));
}
