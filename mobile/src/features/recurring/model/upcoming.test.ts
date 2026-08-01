import type { Recurring } from '@/entities/recurring/model';

import { nextAutoCharge } from './upcoming';

function rec(id: string, cycleDay: number, autoRecord = true): Recurring {
  return {
    id,
    name: id,
    amount: 10_000,
    cycleDay,
    categoryId: 'telecom',
    paymentMethodId: null,
    autoRecord,
    remindBeforeDays: 3,
    lastRecordedMonth: null,
  };
}

describe('nextAutoCharge', () => {
  it('가장 가까운 자동기록 하나만 고른다', () => {
    const next = nextAutoCharge([rec('a', 25), rec('b', 12), rec('c', 20)], new Date(2026, 6, 10));

    expect(next?.recurring.id).toBe('b');
    expect(next?.date).toBe('2026-07-12');
    expect(next?.daysLeft).toBe(2);
  });

  it('더 가까워도 수동 항목이면 건너뛴다', () => {
    // 수동 3일 뒤 vs 자동 9일 뒤 → 자동을 고른다. 모르는 사이에 깨지는 건 자동뿐이다.
    const next = nextAutoCharge([rec('manual', 13, false), rec('auto', 19)], new Date(2026, 6, 10));

    expect(next?.recurring.id).toBe('auto');
    expect(next?.daysLeft).toBe(9);
  });

  it('이번 달 결제일이 지났으면 다음 달로 넘어간다', () => {
    expect(nextAutoCharge([rec('a', 3)], new Date(2026, 6, 10))?.date).toBe('2026-08-03');
  });

  it('오늘이 결제일이면 0일 남음이다', () => {
    expect(nextAutoCharge([rec('a', 10)], new Date(2026, 6, 10))?.daysLeft).toBe(0);
  });

  it('자동기록이 하나도 없으면 null', () => {
    expect(nextAutoCharge([rec('a', 12, false)], new Date(2026, 6, 10))).toBeNull();
    expect(nextAutoCharge([], new Date(2026, 6, 10))).toBeNull();
  });
});
