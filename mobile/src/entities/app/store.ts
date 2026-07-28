import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

type State = {
  /** 온보딩을 끝냈는지. 첫 실행 판정의 유일한 기준이다. */
  onboarded: boolean;
  /** persist 복원 전에는 어디로 보낼지 알 수 없다. 복원 전 라우팅을 막는 신호. */
  hydrated: boolean;
  /**
   * 예산 초과를 이미 알린 달(YYYY-MM). 초과 상태는 달이 끝날 때까지 이어지므로
   * 이걸 남기지 않으면 홈에 들어올 때마다 같은 경고가 뜬다.
   */
  budgetAlerted: string[];
};

type Actions = { complete: () => void; reset: () => void; alertBudget: (ym: string) => void };

export const useAppState = create<State & Actions>()(
  persist(
    (set) => ({
      onboarded: false,
      hydrated: false,
      budgetAlerted: [],
      complete: () => set({ onboarded: true }),
      reset: () => set({ onboarded: false }),
      alertBudget: (ym) =>
        set((s) => (s.budgetAlerted.includes(ym) ? s : { budgetAlerted: [...s.budgetAlerted, ym] })),
    }),
    {
      name: 'moneyminder.app.v1',
      storage: persistStorage,
      partialize: ({ onboarded, budgetAlerted }) => ({ onboarded, budgetAlerted }),
      onRehydrateStorage: () => () => useAppState.setState({ hydrated: true }),
    },
  ),
);
