import { z } from 'zod';

import { monthKey, toDateKey } from '@/shared/lib/format';

export const transactionTypeSchema = z.enum(['expense', 'income']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  type: transactionTypeSchema,
  /** 항상 양수. 방향은 type이 정한다. */
  amount: z.number().positive(),
  categoryId: z.string(),
  paymentMethodId: z.string().nullable(),
  merchant: z.string().default(''),
  memo: z.string().default(''),
  /** YYYY-MM-DD */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** 고정지출에서 자동 생성된 건지 — 내역에 "자동기록"으로 표시. */
  autoRecorded: z.boolean().default(false),
});

export type Transaction = z.infer<typeof transactionSchema>;

export { monthKey, toDateKey };

export function isExpense(t: Transaction): boolean {
  return t.type === 'expense';
}

export function sumExpense(txns: readonly Transaction[]): number {
  return txns.reduce((sum, t) => (isExpense(t) ? sum + t.amount : sum), 0);
}

export function sumIncome(txns: readonly Transaction[]): number {
  return txns.reduce((sum, t) => (isExpense(t) ? sum : sum + t.amount), 0);
}

export function isSameMonth(dateKey: string, ym: string): boolean {
  return dateKey.startsWith(ym);
}

export function filterMonth(txns: readonly Transaction[], ym: string): Transaction[] {
  return txns.filter((t) => isSameMonth(t.date, ym));
}

export function groupByDate(txns: readonly Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();

  for (const t of txns) {
    const bucket = map.get(t.date);
    if (bucket) bucket.push(t);
    else map.set(t.date, [t]);
  }

  return map;
}

export function sumByCategory(txns: readonly Transaction[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const t of txns) {
    if (!isExpense(t)) continue;
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }

  return map;
}

export function sumByPaymentMethod(txns: readonly Transaction[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const t of txns) {
    if (!isExpense(t) || t.paymentMethodId == null) continue;
    map.set(t.paymentMethodId, (map.get(t.paymentMethodId) ?? 0) + t.amount);
  }

  return map;
}
