import {
  billingDate,
  daysUntilBilling,
  dueForReminder,
  isSettledThisMonth,
  monthlyTotal,
  type Recurring,
  remainingThisMonth,
  shouldAutoRecord,
  sortByUpcoming,
} from './schedule';

function rec(over: Partial<Recurring> = {}): Recurring {
  return {
    id: 'netflix',
    name: '넷플릭스',
    amount: 17_000,
    cycleDay: 5,
    categoryId: 'subscription',
    paymentMethodId: 'shinhan',
    autoRecord: true,
    remindBeforeDays: 3,
    lastRecordedMonth: null,
    ...over,
  };
}

describe('billingDate', () => {
  it('말일이 없는 달은 그 달 마지막 날로 당긴다', () => {
    // 2026-02는 28일까지 → 31일 결제는 28일로
    expect(billingDate(2026, 1, 31).getDate()).toBe(28);
  });

  it('윤년 2월은 29일까지 인정한다', () => {
    expect(billingDate(2028, 1, 31).getDate()).toBe(29);
  });

  it('30일 결제는 2월엔 당겨지고 3월엔 그대로다', () => {
    expect(billingDate(2026, 1, 30).getDate()).toBe(28);
    expect(billingDate(2026, 2, 30).getDate()).toBe(30);
  });
});

describe('daysUntilBilling', () => {
  it('결제일 전이면 남은 일수', () => {
    expect(daysUntilBilling(rec(), new Date(2026, 6, 2))).toBe(3);
  });

  it('결제일 당일은 0', () => {
    expect(daysUntilBilling(rec(), new Date(2026, 6, 5))).toBe(0);
  });

  it('결제일이 지났으면 다음 달로 넘어간다', () => {
    // 7/6 기준 다음 결제는 8/5 → 30일 뒤
    expect(daysUntilBilling(rec(), new Date(2026, 6, 6))).toBe(30);
  });
});

describe('isSettledThisMonth', () => {
  it('결제일 당일은 아직 완료가 아니다', () => {
    expect(isSettledThisMonth(rec(), new Date(2026, 6, 5))).toBe(false);
  });

  it('결제일이 지나면 완료다', () => {
    expect(isSettledThisMonth(rec(), new Date(2026, 6, 6))).toBe(true);
  });
});

describe('remainingThisMonth', () => {
  const items = [rec({ cycleDay: 1, amount: 99_000 }), rec({ cycleDay: 5, amount: 17_000 }), rec({ cycleDay: 25, amount: 55_000 })];

  it('아직 안 빠진 금액만 합산한다', () => {
    // 7/2 기준: 1일 결제는 끝남, 5일·25일이 남음
    expect(remainingThisMonth(items, new Date(2026, 6, 2))).toBe(72_000);
  });

  it('전체 합계와는 별개다', () => {
    expect(monthlyTotal(items)).toBe(171_000);
  });
});

describe('shouldAutoRecord', () => {
  it('결제일이 지났고 이번 달 미기록이면 기록한다', () => {
    expect(shouldAutoRecord(rec(), new Date(2026, 6, 5))).toBe(true);
  });

  it('이번 달에 이미 기록했으면 다시 기록하지 않는다', () => {
    const already = rec({ lastRecordedMonth: '2026-07' });

    expect(shouldAutoRecord(already, new Date(2026, 6, 20))).toBe(false);
  });

  it('지난달 기록은 이번 달 기록을 막지 않는다', () => {
    const lastMonth = rec({ lastRecordedMonth: '2026-06' });

    expect(shouldAutoRecord(lastMonth, new Date(2026, 6, 5))).toBe(true);
  });

  it('자동기록이 꺼져 있으면 기록하지 않는다', () => {
    expect(shouldAutoRecord(rec({ autoRecord: false }), new Date(2026, 6, 20))).toBe(false);
  });

  it('결제일 전에는 기록하지 않는다', () => {
    expect(shouldAutoRecord(rec(), new Date(2026, 6, 4))).toBe(false);
  });
});

describe('dueForReminder', () => {
  it('3일 전부터 알린다', () => {
    expect(dueForReminder(rec(), new Date(2026, 6, 2))).toBe(true);
  });

  it('4일 전에는 알리지 않는다', () => {
    expect(dueForReminder(rec(), new Date(2026, 6, 1))).toBe(false);
  });

  it('당일에는 알리지 않는다 — 이미 늦었다', () => {
    expect(dueForReminder(rec(), new Date(2026, 6, 5))).toBe(false);
  });

  it('알림을 끄면 알리지 않는다', () => {
    expect(dueForReminder(rec({ remindBeforeDays: 0 }), new Date(2026, 6, 2))).toBe(false);
  });
});

describe('sortByUpcoming', () => {
  it('가까운 결제일 순으로 정렬한다', () => {
    const items = [rec({ id: 'a', cycleDay: 25 }), rec({ id: 'b', cycleDay: 5 }), rec({ id: 'c', cycleDay: 15 })];
    const sorted = sortByUpcoming(items, new Date(2026, 6, 2));

    expect(sorted.map((r) => r.id)).toEqual(['b', 'c', 'a']);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const items = [rec({ id: 'a', cycleDay: 25 }), rec({ id: 'b', cycleDay: 5 })];
    sortByUpcoming(items, new Date(2026, 6, 2));

    expect(items.map((r) => r.id)).toEqual(['a', 'b']);
  });
});
