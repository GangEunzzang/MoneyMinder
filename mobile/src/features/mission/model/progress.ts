import type { ActiveMission, MissionSpec } from '@/entities/mission/model';
import { filterMonth, isExpense, sumExpense, type Transaction } from '@/entities/transaction/model';
import { monthKey, toDateKey } from '@/shared/lib/format';

import { startOfWeek, weekProgress } from './no-spend';

export type Progress = {
  /** 지금까지의 값. 단위는 spec.unit 을 따른다. */
  done: number;
  target: number;
  /** 0~1. 게이지용이라 1을 넘지 않는다. */
  ratio: number;
  /**
   * 목표가 상한인 미션(카페 5잔까지)은 적을수록 좋고,
   * 하한인 미션(무지출 4일)은 많을수록 좋다. 문구와 색이 갈린다.
   */
  ceiling: boolean;
  achieved: boolean;
};

function weekTxns(txns: readonly Transaction[], today: Date): Transaction[] {
  const from = toDateKey(startOfWeek(today));
  const to = toDateKey(today);

  return txns.filter((t) => t.date >= from && t.date <= to);
}

function countIn(txns: readonly Transaction[], categoryId: string | null): number {
  return txns.filter((t) => isExpense(t) && (categoryId == null || t.categoryId === categoryId))
    .length;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function missionProgress(
  spec: MissionSpec,
  active: Pick<ActiveMission, 'target'>,
  txns: readonly Transaction[],
  today: Date,
): Progress {
  const target = active.target;

  if (spec.id === 'no-spend') {
    const done = weekProgress(txns, startOfWeek(today), today).achieved;

    return { done, target, ratio: clamp(done / target), ceiling: false, achieved: done >= target };
  }

  if (spec.id === 'daily-budget') {
    const done = sumExpense(txns.filter((t) => t.date === toDateKey(today)));

    return { done, target, ratio: clamp(done / target), ceiling: true, achieved: done <= target };
  }

  if (spec.unit === 'won') {
    const scope = filterMonth(txns, monthKey(today));
    const done =
      spec.categoryId == null
        ? sumExpense(scope)
        : sumExpense(scope.filter((t) => t.categoryId === spec.categoryId));

    return { done, target, ratio: clamp(done / target), ceiling: true, achieved: done <= target };
  }

  const done = countIn(weekTxns(txns, today), spec.categoryId);

  return { done, target, ratio: clamp(done / target), ceiling: true, achieved: done <= target };
}

/** "2잔 남았어요" / "1일 더 하면 달성" — 남은 몫을 사람 말로. */
export function remainingLabel(spec: MissionSpec, progress: Progress): string {
  const left = progress.target - progress.done;

  if (progress.ceiling) {
    if (left < 0) return `${spec.unitLabel === '원' ? '' : ''}목표를 넘었어요`;
    if (left === 0) return '딱 목표까지 왔어요';

    return spec.unit === 'won'
      ? `${left.toLocaleString('ko-KR')}원 남았어요`
      : `${left}${spec.unitLabel} 남았어요`;
  }

  if (left <= 0) return '목표 달성!';

  return `${left}${spec.unitLabel} 더 하면 달성`;
}
