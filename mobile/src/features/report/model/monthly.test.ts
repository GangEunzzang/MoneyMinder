import type { Transaction } from '@/entities/transaction/model';

import { biggestJump, categoryRows, headline, monthlyReport, trend } from './monthly';

function spend(date: string, amount: number, categoryId = 'cafe'): Transaction {
  return {
    id: `${date}-${categoryId}-${amount}`,
    type: 'expense',
    amount,
    categoryId,
    paymentMethodId: null,
    merchant: '',
    memo: '',
    date,
    autoRecorded: false,
  };
}

const TXNS: Transaction[] = [
  spend('2026-07-02', 200_000, 'food'),
  spend('2026-07-10', 100_000, 'cafe'),
  spend('2026-07-15', 50_000, 'transport'),
  spend('2026-06-03', 250_000, 'food'),
  spend('2026-06-11', 50_000, 'cafe'),
];

describe('monthlyReport', () => {
  it('이번 달·지난달 지출과 차액을 함께 낸다', () => {
    const r = monthlyReport(TXNS, '2026-07');

    expect(r.expense).toBe(350_000);
    expect(r.prevExpense).toBe(300_000);
    expect(r.saved).toBe(-50_000);
  });

  it('수입은 지출 합계에 섞이지 않는다', () => {
    const withIncome: Transaction[] = [
      ...TXNS,
      { ...spend('2026-07-20', 2_600_000, 'salary'), type: 'income' },
    ];

    expect(monthlyReport(withIncome, '2026-07').expense).toBe(350_000);
  });
});

describe('categoryRows', () => {
  it('많이 쓴 순으로 비중과 전월 대비를 낸다', () => {
    const rows = categoryRows(TXNS, '2026-07');

    expect(rows.map((r) => r.categoryId)).toEqual(['food', 'cafe', 'transport']);
    expect(rows[0]).toMatchObject({ amount: 200_000, share: 57, delta: -20 });
    expect(rows[1]).toMatchObject({ amount: 100_000, share: 29, delta: 100 });
  });

  it('지난달에 없던 카테고리는 비교 불가라 delta 가 null', () => {
    expect(categoryRows(TXNS, '2026-07')[2].delta).toBeNull();
  });

  it('limit 만큼만 자른다', () => {
    expect(categoryRows(TXNS, '2026-07', 2)).toHaveLength(2);
  });

  it('기록이 없는 달은 빈 배열', () => {
    expect(categoryRows(TXNS, '2026-05')).toEqual([]);
  });
});

describe('trend', () => {
  it('기준 달까지 6개월을 오름차순으로 낸다', () => {
    const points = trend(TXNS, '2026-07');

    expect(points).toHaveLength(6);
    expect(points.map((p) => p.ym)).toEqual([
      '2026-02',
      '2026-03',
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
    ]);
    expect(points.at(-1)).toEqual({ ym: '2026-07', expense: 350_000, current: true });
  });

  it('기록 없는 달도 0으로 남긴다 — 막대 높이를 비교해야 하므로', () => {
    expect(trend(TXNS, '2026-07')[0].expense).toBe(0);
  });
});

describe('headline', () => {
  it('덜 썼으면 아낀 금액을 말한다', () => {
    expect(headline(monthlyReport(TXNS, '2026-06'))).toBe('이번 달 첫 기록이에요');
  });

  it('더 썼으면 더 쓴 금액을 말한다', () => {
    expect(headline(monthlyReport(TXNS, '2026-07'))).toBe('지난달보다 50,000원 더 썼어요');
  });

  it('비교할 지난달이 없으면 지난달을 들먹이지 않는다', () => {
    expect(headline(monthlyReport([spend('2026-07-01', 1000)], '2026-07'))).toBe(
      '이번 달 첫 기록이에요',
    );
  });

  it('똑같이 썼으면 그렇게 말한다', () => {
    const same = [spend('2026-07-01', 1000), spend('2026-06-01', 1000)];

    expect(headline(monthlyReport(same, '2026-07'))).toBe('지난달과 똑같이 썼어요');
  });
});

describe('biggestJump', () => {
  it('가장 크게 늘어난 카테고리를 고른다', () => {
    expect(biggestJump(categoryRows(TXNS, '2026-07'))?.categoryId).toBe('cafe');
  });

  it('늘어난 게 없으면 null', () => {
    expect(biggestJump(categoryRows(TXNS, '2026-06'))).toBeNull();
  });
});
