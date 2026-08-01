import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

import type { ActiveMission, MissionId, MissionPeriod } from './model';

/** 무지출은 앱의 기본 미션이라 처음부터 켜져 있다. */
const SEED: ActiveMission[] = [
  { id: 'no-spend', target: 4, period: 'forever', startedOn: '2026-07-01' },
];

type State = {
  active: ActiveMission[];
  /** 주 몇 일을 무지출로 보낼지. 홈·미션·설정이 같은 값을 본다. */
  weeklyGoal: number;
  remind: boolean;
  /** 리마인더 시각(0~23). 저녁에 오늘 지출을 돌아보게 하는 용도라 기본은 21시. */
  remindHour: number;
  /**
   * 이미 축하한 회차(`미션id:회차키`). 완주는 회차가 닫힌 뒤 계속 참이라
   * 이걸 남기지 않으면 미션을 열 때마다 같은 축하가 다시 뜬다.
   */
  celebrated: string[];
  /** 축하를 이미 띄운 배지 id. 없으면 앱을 열 때마다 같은 배지가 다시 뜬다. */
  seenBadges: string[];
};

type Actions = {
  start: (m: ActiveMission) => void;
  update: (id: MissionId, patch: Partial<Pick<ActiveMission, 'target' | 'period'>>) => void;
  stop: (id: MissionId) => void;
  celebrate: (id: MissionId, periodKey: string) => void;
  configure: (patch: Partial<Pick<State, 'weeklyGoal' | 'remind' | 'remindHour'>>) => void;
  resetStreak: () => void;
  seeBadges: (ids: string[]) => void;
};

export function celebrationKey(id: string, periodKey: string): string {
  return `${id}:${periodKey}`;
}

export const useMissions = create<State & Actions>()(
  persist(
    (set) => ({
      active: SEED,
      celebrated: [],
      seenBadges: [],
      weeklyGoal: 4,
      remind: true,
      remindHour: 21,
      start: (m) => set((s) => ({ active: [...s.active.filter((x) => x.id !== m.id), m] })),
      update: (id, patch) =>
        set((s) => ({ active: s.active.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      stop: (id) => set((s) => ({ active: s.active.filter((m) => m.id !== id) })),
      configure: (patch) => set(patch),
      resetStreak: () => set({ celebrated: [] }),
      seeBadges: (ids) =>
        set((s) => ({ seenBadges: [...new Set([...s.seenBadges, ...ids])] })),

      celebrate: (id, periodKey) =>
        set((s) => {
          const key = celebrationKey(id, periodKey);

          return s.celebrated.includes(key) ? s : { celebrated: [...s.celebrated, key] };
        }),
    }),
    { name: 'moneyminder.missions.v1', storage: persistStorage },
  ),
);

export function useActiveMission(id: string | null): ActiveMission | undefined {
  return useMissions((s) => (id ? s.active.find((m) => m.id === id) : undefined));
}

export type { MissionPeriod };
