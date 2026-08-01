import type { Transaction } from '@/entities/transaction/model';

import { currentStreak, noSpendDaysInMonth } from './no-spend';

export type BadgeKind = 'streak' | 'count' | 'mission';

export type BadgeSpec = {
  id: string;
  label: string;
  kind: BadgeKind;
  /** 이 값을 넘기면 획득. kind 마다 세는 대상이 다르다. */
  goal: number;
  /** 아직 못 받았을 때 보여줄 한 줄. */
  hint: string;
};

/**
 * 배지는 셋을 섞는다 — 연속(streak) · 누적(count) · 미션 완주(mission).
 * 하나만 있으면 스트릭이 끊긴 사람에게 남는 목표가 없다.
 */
export const BADGES: readonly BadgeSpec[] = [
  { id: 'first', label: '첫걸음', kind: 'count', goal: 1, hint: '무지출 하루를 만들어보세요' },
  { id: 'streak7', label: '7일', kind: 'streak', goal: 7, hint: '7일 연속 무지출' },
  { id: 'streak14', label: '14일', kind: 'streak', goal: 14, hint: '14일 연속 무지출' },
  { id: 'streak30', label: '30일', kind: 'streak', goal: 30, hint: '30일 연속 무지출' },
  { id: 'streak50', label: '50일', kind: 'streak', goal: 50, hint: '50일 연속 무지출' },
  { id: 'streak100', label: '100일', kind: 'streak', goal: 100, hint: '100일 연속 무지출' },
  { id: 'week', label: '주간달성', kind: 'count', goal: 4, hint: '한 달에 무지출 4일' },
  { id: 'month', label: '한달완주', kind: 'count', goal: 15, hint: '한 달에 무지출 15일' },
  { id: 'saver', label: '절약가', kind: 'count', goal: 20, hint: '한 달에 무지출 20일' },
  { id: 'cafe', label: '카페단절', kind: 'mission', goal: 1, hint: '카페 다이어트 완주' },
  { id: 'delivery', label: '야식끊기', kind: 'mission', goal: 2, hint: '미션 2회 완주' },
  { id: 'king', label: '무지출왕', kind: 'mission', goal: 5, hint: '미션 5회 완주' },
] as const;

export type BadgeState = BadgeSpec & { earned: boolean; progress: number };

export function badgeStates(
  txns: readonly Transaction[],
  ym: string,
  today: Date,
  completions: number,
): BadgeState[] {
  const streak = currentStreak(txns, today);
  const monthDays = noSpendDaysInMonth(txns, ym, today);

  return BADGES.map((b) => {
    const progress = b.kind === 'streak' ? streak : b.kind === 'count' ? monthDays : completions;

    return { ...b, progress, earned: progress >= b.goal };
  });
}

export function earnedCount(states: readonly BadgeState[]): number {
  return states.filter((s) => s.earned).length;
}
