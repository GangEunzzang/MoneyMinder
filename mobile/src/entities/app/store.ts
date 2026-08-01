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
  /** 프로필. 로그인이 붙기 전까지는 로컬에만 있다. */
  nickname: string;
  email: string;
  bio: string;
  /** 알림 스위치. 키는 화면과 1:1이라 새 알림이 생기면 여기만 늘린다. */
  notify: Record<NotifyKey, boolean>;
};

export type NotifyKey =
  | 'noSpendRemind'
  | 'missionDone'
  | 'badge'
  | 'budgetOver'
  | 'weekly'
  | 'bigSpend'
  | 'marketing';

type Actions = {
  complete: () => void;
  reset: () => void;
  alertBudget: (ym: string) => void;
  editProfile: (patch: Partial<Pick<State, 'nickname' | 'email' | 'bio'>>) => void;
  setNotify: (key: NotifyKey, on: boolean) => void;
  /** 탈퇴. 저장된 것을 전부 비우고 온보딩부터 다시 시작한다. */
  wipe: () => void;
};

export const useAppState = create<State & Actions>()(
  persist(
    (set) => ({
      onboarded: false,
      hydrated: false,
      budgetAlerted: [],
      nickname: '은짱',
      email: '',
      bio: '',
      notify: {
        noSpendRemind: true,
        missionDone: true,
        badge: true,
        budgetOver: true,
        weekly: false,
        bigSpend: false,
        marketing: false,
      },
      complete: () => set({ onboarded: true }),
      reset: () => set({ onboarded: false }),
      alertBudget: (ym) =>
        set((s) => (s.budgetAlerted.includes(ym) ? s : { budgetAlerted: [...s.budgetAlerted, ym] })),

      editProfile: (patch) => set(patch),

      setNotify: (key, on) => set((s) => ({ notify: { ...s.notify, [key]: on } })),

      wipe: () => set({ onboarded: false, budgetAlerted: [] }),
    }),
    {
      name: 'moneyminder.app.v1',
      storage: persistStorage,
      partialize: ({ onboarded, budgetAlerted, nickname, email, bio, notify }) => ({
        onboarded,
        budgetAlerted,
        nickname,
        email,
        bio,
        notify,
      }),
      onRehydrateStorage: () => () => useAppState.setState({ hydrated: true }),
    },
  ),
);
