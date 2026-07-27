import type { Transaction } from '@/entities/transaction/model';

import {
  currentStreak,
  isNoSpendDay,
  noSpendDaysInMonth,
  savedAmount,
  startOfWeek,
  weekProgress,
} from './no-spend';

function txn(date: string, over: Partial<Transaction> = {}): Transaction {
  return {
    id: `${date}-${over.amount ?? 0}`,
    type: 'expense',
    amount: 1000,
    categoryId: 'food',
    paymentMethodId: null,
    merchant: '',
    memo: '',
    date,
    autoRecorded: false,
    ...over,
  };
}

describe('isNoSpendDay', () => {
  it('지출이 없으면 무지출이다', () => {
    expect(isNoSpendDay([], '2026-07-10')).toBe(true);
  });

  it('지출이 있으면 무지출이 아니다', () => {
    expect(isNoSpendDay([txn('2026-07-10')], '2026-07-10')).toBe(false);
  });

  it('수입만 있는 날은 무지출이다', () => {
    const income = [txn('2026-07-10', { type: 'income', amount: 2_600_000 })];

    expect(isNoSpendDay(income, '2026-07-10')).toBe(true);
  });

  it('다른 날 지출은 영향을 주지 않는다', () => {
    expect(isNoSpendDay([txn('2026-07-09')], '2026-07-10')).toBe(true);
  });
});

describe('currentStreak', () => {
  const today = new Date(2026, 6, 10);

  it('오늘 포함 연속 무지출을 센다', () => {
    expect(currentStreak([txn('2026-07-07')], today)).toBe(3);
  });

  it('오늘 지출이 있어도 어제까지의 스트릭은 유지된다', () => {
    const txns = [txn('2026-07-10'), txn('2026-07-06')];

    expect(currentStreak(txns, today)).toBe(3);
  });

  it('어제 지출이 있으면 오늘 지출 시 0이다', () => {
    const txns = [txn('2026-07-10'), txn('2026-07-09')];

    expect(currentStreak(txns, today)).toBe(0);
  });
});

describe('noSpendDaysInMonth', () => {
  it('미래 날짜는 성공으로 세지 않는다', () => {
    const today = new Date(2026, 6, 3);

    // 7/1~7/3 중 7/2만 지출 → 무지출 2일. 남은 28일은 아직 오지 않았다.
    expect(noSpendDaysInMonth([txn('2026-07-02')], '2026-07', today)).toBe(2);
  });

  it('말일이 30일인 달의 경계를 정확히 센다', () => {
    const today = new Date(2026, 5, 30);

    expect(noSpendDaysInMonth([], '2026-06', today)).toBe(30);
  });
});

describe('weekProgress', () => {
  it('월요일 시작으로 주간 달성을 센다', () => {
    const today = new Date(2026, 6, 9); // 목요일
    const start = startOfWeek(today);
    const { done, achieved } = weekProgress([txn('2026-07-07')], start, today);

    expect(done).toHaveLength(7);
    expect(achieved).toBe(3); // 월·수·목 (화요일 지출)
    expect(done.slice(4)).toEqual([false, false, false]); // 금·토·일은 미래
  });
});

describe('savedAmount', () => {
  it('평균 지출 × 무지출 일수', () => {
    expect(savedAmount(21_400, 12)).toBe(256_800);
  });

  it('음수는 0으로 막는다', () => {
    expect(savedAmount(-100, 3)).toBe(0);
  });
});
