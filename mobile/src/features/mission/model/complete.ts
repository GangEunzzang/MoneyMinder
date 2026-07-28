import type { ActiveMission, MissionPeriod, MissionSpec } from '@/entities/mission/model';
import { isExpense, type Transaction } from '@/entities/transaction/model';
import { monthKey, toDateKey } from '@/shared/lib/format';

import { startOfWeek } from './no-spend';
import { missionProgress } from './progress';

/**
 * 끝난 회차 하나. "이번 주 잘하고 있어요"(progress)와 달리 이건 이미 닫힌 성적표라
 * 다시 계산해도 값이 바뀌지 않는다.
 */
export type Completion = {
  /** 주간은 그 주 월요일(YYYY-MM-DD), 월간은 YYYY-MM. 축하를 한 번만 하기 위한 키. */
  periodKey: string;
  done: number;
  target: number;
  /** 직전 회차의 실적. 첫 회차면 null — 비교할 대상이 없다. */
  previousDone: number | null;
  /** 목표보다 덜 쓴 만큼을 돈으로. 근거를 못 대면 null (평균을 낼 표본이 없을 때). */
  saved: number | null;
  /** 이번 회차를 포함해 연속 몇 번 완주했는지. */
  streak: number;
  /** 한 칸 더 조인 다음 목표. 더 낮출 선택지가 없으면 지금 목표 그대로. */
  nextTarget: number;
};

/** 평균 단가를 믿으려면 이만큼은 결제가 있어야 한다. 두어 건으로 "8,400원 아꼈다"고 하면 거짓말이 된다. */
const MIN_SAMPLES = 3;

/** 연속 완주를 거슬러 셀 상한. 기록이 없는 과거까지 무한히 세지 않는다. */
const MAX_LOOKBACK = 260;

function shiftDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);

  return copy;
}

/** 그 날짜가 속한 회차의 키. */
export function periodKeyOf(period: MissionPeriod, day: Date): string | null {
  if (period === 'week') return toDateKey(startOfWeek(day));
  if (period === 'month') return monthKey(day);

  return null;
}

/** 그 날짜가 속한 회차의 첫날. */
function periodStart(period: MissionPeriod, day: Date): Date {
  return period === 'week' ? startOfWeek(day) : new Date(day.getFullYear(), day.getMonth(), 1);
}

/** 오늘 기준으로 가장 최근에 닫힌 회차의 마지막 날. 진행 중인 회차는 아직 성적표가 아니다. */
export function lastClosedDay(period: MissionPeriod, today: Date): Date | null {
  if (period === 'week') return shiftDays(startOfWeek(today), -1);
  if (period === 'month') return new Date(today.getFullYear(), today.getMonth(), 0);

  return null;
}

/** 한 회차 앞의 마지막 날. */
function previousClosedDay(period: MissionPeriod, end: Date): Date {
  return period === 'week' ? shiftDays(end, -7) : new Date(end.getFullYear(), end.getMonth(), 0);
}

/** 미션이 시작되기 전에 열린 회차는 성적표로 치지 않는다 — 미션이 없던 날들이 섞인다. */
function withinMission(active: ActiveMission, period: MissionPeriod, end: Date): boolean {
  return toDateKey(periodStart(period, end)) >= active.startedOn;
}

function achievedOn(
  spec: MissionSpec,
  active: ActiveMission,
  txns: readonly Transaction[],
  end: Date,
): { done: number; achieved: boolean } {
  const { done, achieved } = missionProgress(spec, active, txns, end);

  return { done, achieved };
}

/** 이번 회차를 포함해 연속으로 몇 번 완주했는지. 실패한 회차나 미션 시작 이전에서 멈춘다. */
export function completionStreak(
  spec: MissionSpec,
  active: ActiveMission,
  txns: readonly Transaction[],
  end: Date,
): number {
  let cursor = end;
  let streak = 0;

  for (let i = 0; i < MAX_LOOKBACK; i += 1) {
    if (!withinMission(active, active.period, cursor)) break;
    if (!achievedOn(spec, active, txns, cursor).achieved) break;
    streak += 1;
    cursor = previousClosedDay(active.period, cursor);
  }

  return streak;
}

function averagePrice(
  txns: readonly Transaction[],
  categoryId: string | null,
  until: Date,
): number | null {
  const untilKey = toDateKey(until);
  const scope = txns.filter(
    (t) => isExpense(t) && t.date <= untilKey && (categoryId == null || t.categoryId === categoryId),
  );

  if (scope.length < MIN_SAMPLES) return null;

  return Math.round(scope.reduce((sum, t) => sum + t.amount, 0) / scope.length);
}

/**
 * 목표보다 덜 쓴 만큼의 돈. 금액 미션은 차액 그대로, 횟수 미션은 평균 단가를 곱한다.
 * 목표를 넘겼거나 표본이 모자라면 null — 아낀 돈을 지어내지 않는다.
 */
export function savedByMission(
  spec: MissionSpec,
  target: number,
  done: number,
  txns: readonly Transaction[],
  until: Date,
): number | null {
  const spared = target - done;
  if (spared <= 0) return null;
  if (spec.unit === 'won') return spared;
  if (spec.unit !== 'count') return null;

  const price = averagePrice(txns, spec.categoryId, until);

  return price == null ? null : price * spared;
}

/** 지금보다 한 칸 조인 목표. 상한형 미션은 적을수록 어렵다. */
export function nextTarget(spec: MissionSpec, target: number): number {
  const tighter = spec.targetChoices.filter((choice) => choice < target);

  return tighter.length > 0 ? Math.max(...tighter) : target;
}

/**
 * 가장 최근에 닫힌 회차의 완주 성적표. 완주하지 못했거나 아직 닫힌 회차가 없으면 null —
 * 이 화면은 축하 전용이라 실패한 회차를 열지 않는다.
 */
export function completion(
  spec: MissionSpec,
  active: ActiveMission,
  txns: readonly Transaction[],
  today: Date,
): Completion | null {
  // 상한이 없는 미션(무지출 4일 이상)은 "덜 썼다"는 성적표를 낼 수 없다.
  if (spec.unit === 'day' || spec.id === 'daily-budget') return null;
  // 진행률이 재는 구간과 회차가 어긋나면(횟수는 주 단위, 금액은 달 단위) 성적표가 거짓말을 한다.
  if (active.period !== (spec.unit === 'count' ? 'week' : 'month')) return null;

  const end = lastClosedDay(active.period, today);
  if (end == null || !withinMission(active, active.period, end)) return null;

  const key = periodKeyOf(active.period, end);
  if (key == null) return null;

  const { done, achieved } = achievedOn(spec, active, txns, end);
  if (!achieved) return null;

  const before = previousClosedDay(active.period, end);
  const previousDone = withinMission(active, active.period, before)
    ? achievedOn(spec, active, txns, before).done
    : null;

  return {
    periodKey: key,
    done,
    target: active.target,
    previousDone,
    saved: savedByMission(spec, active.target, done, txns, end),
    streak: completionStreak(spec, active, txns, end),
    nextTarget: nextTarget(spec, active.target),
  };
}
