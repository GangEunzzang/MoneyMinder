import { daysUntilBilling, nextBillingDate, type Recurring } from '@/entities/recurring/model';
import { toDateKey } from '@/shared/lib/format';

export type Upcoming = {
  recurring: Recurring;
  date: string;
  daysLeft: number;
};

/**
 * 다음에 스스로 찍힐 고정지출. 자동기록만 본다 — 수동 항목은 사용자가 기록해야
 * 지출이 되므로 모르는 사이에 무지출을 깨지 않는다.
 *
 * 끊기고 나서 알면 앱이 거짓말한 것처럼 보인다. 그래서 홈이 미리 말한다.
 */
export function nextAutoCharge(items: readonly Recurring[], today: Date): Upcoming | null {
  let soonest: Upcoming | null = null;

  for (const r of items) {
    if (!r.autoRecord) continue;

    const daysLeft = daysUntilBilling(r, today);
    if (soonest != null && daysLeft >= soonest.daysLeft) continue;

    soonest = { recurring: r, date: toDateKey(nextBillingDate(r, today)), daysLeft };
  }

  return soonest;
}
