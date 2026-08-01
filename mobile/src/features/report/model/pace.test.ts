import type { Transaction } from '@/entities/transaction/model';

import { monthPace } from './pace';

let seq = 0;

function txn(date: string, amount: number): Transaction {
  seq += 1;

  return {
    id: `t${seq}`,
    type: 'expense',
    amount,
    categoryId: 'cafe',
    paymentMethodId: null,
    merchant: '',
    memo: '',
    date,
    autoRecorded: false,
  };
}

describe('monthPace', () => {
  it('지난달은 같은 날짜까지만 견준다', () => {
    const txns = [
      txn('2026-07-05', 10_000),
      txn('2026-07-20', 5_000),
      txn('2026-06-05', 30_000),
      // 6월 25일 이후 지출은 비교에서 빠진다 — 7월은 아직 10일이니까.
      txn('2026-06-28', 90_000),
    ];

    const pace = monthPace(txns, '2026-07', new Date(2026, 6, 10));

    expect(pace.current).toBe(10_000);
    expect(pace.previous).toBe(30_000);
    expect(pace.saved).toBe(20_000);
  });

  it('더 썼으면 saved 가 음수다', () => {
    const pace = monthPace([txn('2026-07-03', 50_000), txn('2026-06-03', 10_000)], '2026-07', new Date(2026, 6, 10));

    expect(pace.saved).toBe(-40_000);
  });

  it('지난달이 짧으면 말일까지만 본다', () => {
    // 3월 31일에 서 있어도 2월은 28일까지밖에 없다.
    const pace = monthPace([txn('2026-02-28', 7_000)], '2026-03', new Date(2026, 2, 31));

    expect(pace.previous).toBe(7_000);
  });

  it('수입은 세지 않는다', () => {
    const income: Transaction = { ...txn('2026-07-02', 500_000), type: 'income' };

    expect(monthPace([income], '2026-07', new Date(2026, 6, 10)).current).toBe(0);
  });
});
