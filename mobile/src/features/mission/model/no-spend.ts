import { isExpense, toDateKey, type Transaction } from '@/entities/transaction/model';

/**
 * 무지출 판정 (DECISIONS 핵심 정책): 하루 지출 합계가 0원이면 무지출.
 * 수입만 있는 날도 무지출이다 — 아낀 것과 번 것은 다른 축이니까.
 */
export function isNoSpendDay(txns: readonly Transaction[], dateKey: string): boolean {
  return !txns.some((t) => t.date === dateKey && isExpense(t));
}

export function noSpendDaysInMonth(txns: readonly Transaction[], ym: string, today: Date): number {
  const [y, m] = ym.split('-').map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const todayKey = toDateKey(today);
  let count = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const key = `${ym}-${String(day).padStart(2, '0')}`;
    // 아직 오지 않은 날은 세지 않는다. 미래를 성공으로 계산하면 숫자가 거짓말이 된다.
    if (key > todayKey) break;
    if (isNoSpendDay(txns, key)) count += 1;
  }

  return count;
}

/**
 * 연속 무지출 스트릭. 오늘부터 거슬러 세되, 오늘 지출이 있으면 어제까지로 본다.
 * (오늘은 아직 안 끝났으므로 오늘의 지출이 어제까지의 기록을 무효화하지 않는다.)
 */
export function currentStreak(txns: readonly Transaction[], today: Date): number {
  const cursor = new Date(today);
  let streak = 0;

  if (!isNoSpendDay(txns, toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  while (isNoSpendDay(txns, toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    // 기록이 없는 과거까지 무한히 세지 않도록 상한을 둔다.
    if (streak > 3650) break;
  }

  return streak;
}

/** 주간 미션 진행: 월~일 중 무지출인 날. */
export function weekProgress(
  txns: readonly Transaction[],
  weekStart: Date,
  today: Date,
): { done: boolean[]; achieved: number } {
  const todayKey = toDateKey(today);
  const done: boolean[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = toDateKey(d);
    done.push(key <= todayKey && isNoSpendDay(txns, key));
  }

  return { done, achieved: done.filter(Boolean).length };
}

export function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  copy.setHours(0, 0, 0, 0);

  return copy;
}

/** 아낀 돈 = 평소 하루 평균 지출 × 무지출 일수. 근거 없는 숫자를 만들지 않는다. */
export function savedAmount(avgDailySpend: number, noSpendDays: number): number {
  return Math.max(0, Math.round(avgDailySpend * noSpendDays));
}
