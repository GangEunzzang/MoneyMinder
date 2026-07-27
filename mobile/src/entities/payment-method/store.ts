import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PaymentMethod } from './model';

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

export const usePaymentMethods = create<State & Actions>()(
  persist(
    (set) => ({
      methods: SEED,
      add: (pm) => set((s) => ({ methods: [...s.methods, pm] })),
      update: (id, patch) =>
        set((s) => ({ methods: s.methods.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      remove: (id) => set((s) => ({ methods: s.methods.filter((m) => m.id !== id) })),
    }),
    { name: 'moneyminder.payment-methods.v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export function usePaymentMethod(id: string | null): PaymentMethod | undefined {
  return usePaymentMethods((s) => (id ? s.methods.find((m) => m.id === id) : undefined));
}
