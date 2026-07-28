import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

import type { ActiveMission, MissionId, MissionPeriod } from './model';

/** 무지출은 앱의 기본 미션이라 처음부터 켜져 있다. */
const SEED: ActiveMission[] = [
  { id: 'no-spend', target: 4, period: 'forever', startedOn: '2026-07-01' },
];

type State = { active: ActiveMission[] };

type Actions = {
  start: (m: ActiveMission) => void;
  update: (id: MissionId, patch: Partial<Pick<ActiveMission, 'target' | 'period'>>) => void;
  stop: (id: MissionId) => void;
};

export const useMissions = create<State & Actions>()(
  persist(
    (set) => ({
      active: SEED,
      start: (m) => set((s) => ({ active: [...s.active.filter((x) => x.id !== m.id), m] })),
      update: (id, patch) =>
        set((s) => ({ active: s.active.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      stop: (id) => set((s) => ({ active: s.active.filter((m) => m.id !== id) })),
    }),
    { name: 'moneyminder.missions.v1', storage: persistStorage },
  ),
);

export function useActiveMission(id: string | null): ActiveMission | undefined {
  return useMissions((s) => (id ? s.active.find((m) => m.id === id) : undefined));
}

export type { MissionPeriod };
