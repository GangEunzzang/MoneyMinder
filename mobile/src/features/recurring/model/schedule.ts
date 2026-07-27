import { z } from 'zod';

import { daysBetween, toDateKey } from '@/shared/lib/format';

export const recurringSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  amount: z.number().positive(),
  /** 매월 N일. 말일이 없는 달은 그 달의 마지막 날로 당긴다. */
  cycleDay: z.number().int().min(1).max(31),
  categoryId: z.string(),
  paymentMethodId: z.string().nullable(),
  autoRecord: z.boolean().default(true),
  remindBeforeDays: z.number().int().min(0).max(14).default(3),
  /** 마지막으로 자동기록된 달 (YYYY-MM). 중복 기록 방지의 핵심. */
  lastRecordedMonth: z.string().nullable().default(null),
});

export type Recurring = z.infer<typeof recurringSchema>;

/** 2월 30일 같은 날짜를 요구받으면 그 달 말일로 클램프한다. */
export function billingDate(year: number, month: number, cycleDay: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();

  return new Date(year, month, Math.min(cycleDay, lastDay));
}

export function nextBillingDate(r: Pick<Recurring, 'cycleDay'>, today: Date): Date {
  const thisMonth = billingDate(today.getFullYear(), today.getMonth(), r.cycleDay);

  if (daysBetween(today, thisMonth) >= 0) return thisMonth;

  return billingDate(today.getFullYear(), today.getMonth() + 1, r.cycleDay);
}

export function daysUntilBilling(r: Pick<Recurring, 'cycleDay'>, today: Date): number {
  return daysBetween(today, nextBillingDate(r, today));
}

/** 이번 달 결제가 이미 지났는지 — 목록을 "곧 결제 / 이번 달 완료"로 가르는 기준. */
export function isSettledThisMonth(r: Pick<Recurring, 'cycleDay'>, today: Date): boolean {
  return daysBetween(billingDate(today.getFullYear(), today.getMonth(), r.cycleDay), today) > 0;
}

export function monthlyTotal(items: readonly Pick<Recurring, 'amount'>[]): number {
  return items.reduce((sum, r) => sum + r.amount, 0);
}

/** 이번 달 아직 안 빠져나간 금액. 헤더 "이번 달 남은"에 쓴다. */
export function remainingThisMonth(
  items: readonly Pick<Recurring, 'amount' | 'cycleDay'>[],
  today: Date,
): number {
  return items.reduce((sum, r) => (isSettledThisMonth(r, today) ? sum : sum + r.amount), 0);
}

/**
 * 자동기록 대상 판정. 결제일이 지났고 이번 달에 아직 기록 안 된 것만.
 * lastRecordedMonth로 멱등성을 보장한다 — 앱을 하루 열 번 켜도 한 번만 기록된다.
 */
export function shouldAutoRecord(r: Recurring, today: Date): boolean {
  if (!r.autoRecord) return false;

  const ym = toDateKey(today).slice(0, 7);
  if (r.lastRecordedMonth === ym) return false;

  return daysBetween(billingDate(today.getFullYear(), today.getMonth(), r.cycleDay), today) >= 0;
}

export function dueForReminder(r: Recurring, today: Date): boolean {
  if (r.remindBeforeDays === 0) return false;
  const left = daysUntilBilling(r, today);

  return left > 0 && left <= r.remindBeforeDays;
}

export function sortByUpcoming<T extends Pick<Recurring, 'cycleDay'>>(items: readonly T[], today: Date): T[] {
  return [...items].sort((a, b) => daysUntilBilling(a, today) - daysUntilBilling(b, today));
}
