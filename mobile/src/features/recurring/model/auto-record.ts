import { billingDate, type Recurring, shouldAutoRecord } from '@/entities/recurring/model';
import type { Transaction } from '@/entities/transaction/model';
import { toDateKey } from '@/shared/lib/format';

export type PendingRecord = {
  recurringId: string;
  month: string;
  transaction: Omit<Transaction, 'id'>;
};

/**
 * 자동기록 대상을 거래로 변환한다. 실제 쓰기는 하지 않는다 —
 * 순수 함수로 두어야 "무엇이 기록될지"를 테스트로 못박을 수 있다.
 *
 * 날짜는 오늘이 아니라 결제일로 찍는다. 앱을 3일 늦게 열어도
 * 내역은 실제로 돈이 빠져나간 날에 남아야 하기 때문.
 */
export function pendingAutoRecords(items: readonly Recurring[], today: Date): PendingRecord[] {
  const month = toDateKey(today).slice(0, 7);

  return items.filter((r) => shouldAutoRecord(r, today)).map((r) => ({
    recurringId: r.id,
    month,
    transaction: {
      type: 'expense',
      amount: r.amount,
      categoryId: r.categoryId,
      paymentMethodId: r.paymentMethodId,
      merchant: r.name,
      memo: '',
      date: toDateKey(billingDate(today.getFullYear(), today.getMonth(), r.cycleDay)),
      autoRecorded: true,
    },
  }));
}
