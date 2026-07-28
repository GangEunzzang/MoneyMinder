import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

type State = {
  /** 온보딩을 끝냈는지. 첫 실행 판정의 유일한 기준이다. */
  onboarded: boolean;
  /** persist 복원 전에는 어디로 보낼지 알 수 없다. 복원 전 라우팅을 막는 신호. */
  hydrated: boolean;
};

type Actions = { complete: () => void; reset: () => void };

export const useAppState = create<State & Actions>()(
  persist(
    (set) => ({
      onboarded: false,
      hydrated: false,
      complete: () => set({ onboarded: true }),
      reset: () => set({ onboarded: false }),
    }),
    {
      name: 'moneyminder.app.v1',
      storage: persistStorage,
      partialize: ({ onboarded }) => ({ onboarded }),
      onRehydrateStorage: () => () => useAppState.setState({ hydrated: true }),
    },
  ),
);
