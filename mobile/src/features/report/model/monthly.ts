import {
  filterMonth,
  monthKey,
  sumByCategory,
  sumExpense,
  type Transaction,
} from '@/entities/transaction/model';
import { shiftMonth } from '@/shared/lib/format';

import { monthPace } from './pace';

export type CategoryRow = {
  categoryId: string;
  amount: number;
  /** 이 달 지출에서 차지하는 비중 (0~100). */
  share: number;
  /** 전월 대비 증감률. 지난달 지출이 없으면 비교 불가라 null. */
  delta: number | null;
};

export type TrendPoint = { ym: string; expense: number; current: boolean };

export type MonthlyReport = {
  ym: string;
  /** 진행 중인 달인지. 비교 기준과 문구가 갈린다. */
  running: boolean;
  expense: number;
  prevExpense: number;
  /** 지난달보다 덜 쓴 금액. 음수면 더 썼다는 뜻. */
  saved: number;
  categories: CategoryRow[];
  trend: TrendPoint[];
};

function ratio(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function changeRate(current: number, previous: number): number | null {
  if (previous <= 0) return null;

  return Math.round(((current - previous) / previous) * 100);
}

/** 카테고리를 많이 쓴 순으로. 지출 0인 카테고리는 뺀다 — 결산은 요약이지 목록이 아니다. */
export function categoryRows(
  txns: readonly Transaction[],
  ym: string,
  limit = 4,
): CategoryRow[] {
  const current = sumByCategory(filterMonth(txns, ym));
  const previous = sumByCategory(filterMonth(txns, shiftMonth(ym, -1)));
  const total = sumExpense(filterMonth(txns, ym));

  return [...current.entries()]
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      share: ratio(amount, total),
      delta: changeRate(amount, previous.get(categoryId) ?? 0),
    }));
}

/** 최근 months 개월 지출 추이. 막대 높이 비교용이라 0인 달도 남긴다. */
export function trend(txns: readonly Transaction[], ym: string, months = 6): TrendPoint[] {
  return Array.from({ length: months }, (_, i) => {
    const key = shiftMonth(ym, i - (months - 1));

    return { ym: key, expense: sumExpense(filterMonth(txns, key)), current: key === ym };
  });
}

/**
 * 진행 중인 달은 지난달 "전체"와 견주면 안 된다 — 3일에 "지난달보다 55만원 덜 썼어요"는
 * 아직 안 끝났을 뿐인데 잘한 것처럼 말한다. 내역의 `monthPace` 와 같은 기준을 쓴다.
 */
export function monthlyReport(
  txns: readonly Transaction[],
  ym: string,
  categoryLimit = 4,
  today: Date = new Date(),
): MonthlyReport {
  const expense = sumExpense(filterMonth(txns, ym));
  const running = ym === monthKey(today);
  const pace = monthPace(txns, ym, today);

  return {
    ym,
    running,
    expense,
    prevExpense: running ? pace.previous : sumExpense(filterMonth(txns, shiftMonth(ym, -1))),
    saved: running ? pace.saved : sumExpense(filterMonth(txns, shiftMonth(ym, -1))) - expense,
    categories: categoryRows(txns, ym, categoryLimit),
    trend: trend(txns, ym),
  };
}

/**
 * 결산 한 줄 요약. 비교 대상이 없으면 지난달을 들먹이지 않는다 —
 * 첫 달 사용자에게 "지난달보다 642,000원 덜 썼어요"는 거짓말이다.
 */
export function headline(report: MonthlyReport): string {
  if (report.prevExpense <= 0) return '이번 달 첫 기록이에요';

  const scope = report.running ? '지난달 같은 기간보다' : '지난달보다';
  const tail = report.running ? '쓰는 중' : '썼어요';

  if (report.saved > 0) return `${scope} ${report.saved.toLocaleString('ko-KR')}원 덜 ${tail}`;
  if (report.saved < 0) return `${scope} ${(-report.saved).toLocaleString('ko-KR')}원 더 ${tail}`;

  return report.running ? '지난달 같은 기간과 똑같이 쓰는 중' : '지난달과 똑같이 썼어요';
}

/** 가장 크게 늘어난 카테고리. 결산 하단 인사이트에 쓴다. */
export function biggestJump(categories: readonly CategoryRow[]): CategoryRow | null {
  const risen = categories.filter((c) => c.delta != null && c.delta > 0);
  if (risen.length === 0) return null;

  return risen.reduce((max, c) => ((c.delta ?? 0) > (max.delta ?? 0) ? c : max));
}
