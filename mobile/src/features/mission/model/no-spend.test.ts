import type { Transaction } from '@/entities/transaction/model';

import {
  currentStreak,
  isNoSpendDay,
  noSpendDaysInMonth,
  noSpendSavings,
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

describe('noSpendDaysInMonth · 첫 기록 이전', () => {
  it('기록이 하나도 없으면 0 — 안 쓴 게 아니라 앱을 안 쓴 것이다', () => {
    expect(noSpendDaysInMonth([], '2026-06', new Date(2026, 5, 30))).toBe(0);
  });

  it('첫 기록 이전 날은 세지 않는다', () => {
    const today = new Date(2026, 6, 10);

    // 첫 기록이 7/8 → 7/1~7/7은 제외, 7/9·7/10만 무지출
    expect(noSpendDaysInMonth([txn('2026-07-08')], '2026-07', today)).toBe(2);
  });

  it('지난달에 기록이 있으면 이번 달은 1일부터 센다', () => {
    const today = new Date(2026, 6, 3);
    const txns = [txn('2026-06-15'), txn('2026-07-02')];

    expect(noSpendDaysInMonth(txns, '2026-07', today)).toBe(2);
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

    // 첫 기록이 7/2 → 7/1은 앱을 쓰기 전. 7/3만 무지출. 남은 28일은 아직 오지 않았다.
    expect(noSpendDaysInMonth([txn('2026-07-02')], '2026-07', today)).toBe(1);
  });

  it('말일이 30일인 달의 경계를 정확히 센다', () => {
    const today = new Date(2026, 5, 30);

    expect(noSpendDaysInMonth([txn('2026-06-01')], '2026-06', today)).toBe(29);
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

describe('noSpendSavings', () => {
  const spend = (date: string, amount: number): Transaction => ({
    id: date,
    type: 'expense',
    amount,
    categoryId: 'cafe',
    paymentMethodId: null,
    merchant: '',
    memo: '',
    date,
    autoRecorded: false,
  });

  it('쓴 날이 5일 미만이면 아낀 돈을 계산하지 않는다', () => {
    const txns = [spend('2026-07-05', 17_000), spend('2026-07-25', 55_000)];

    expect(noSpendSavings(txns, 26)).toBeNull();
  });

  it('쓴 날이 5일 이상이면 평균 × 무지출일로 계산한다', () => {
    const txns = [1, 2, 3, 4, 5].map((d) => spend(`2026-07-0${d}`, 10_000));

    expect(noSpendSavings(txns, 3)).toEqual({ amount: 30_000, spendingDays: 5 });
  });

  it('기록이 없으면 null', () => {
    expect(noSpendSavings([], 30)).toBeNull();
  });

  it('같은 날 여러 건은 하루로 센다', () => {
    const txns = [
      spend('2026-07-01', 1_000),
      { ...spend('2026-07-01', 2_000), id: 'b' },
      spend('2026-07-02', 3_000),
      spend('2026-07-03', 3_000),
      spend('2026-07-04', 3_000),
    ];

    expect(noSpendSavings(txns, 1)).toBeNull();
  });
});
