import type { Recurring } from '@/entities/recurring/model';

import { pendingAutoRecords } from './auto-record';

function make(patch: Partial<Recurring> = {}): Recurring {
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
    ...patch,
  };
}

describe('pendingAutoRecords', () => {
  it('결제일이 지났으면 기록 대상이다', () => {
    const pending = pendingAutoRecords([make()], new Date(2026, 6, 10));

    expect(pending).toHaveLength(1);
    expect(pending[0].recurringId).toBe('netflix');
    expect(pending[0].month).toBe('2026-07');
  });

  it('결제일 당일도 대상이다', () => {
    expect(pendingAutoRecords([make()], new Date(2026, 6, 5))).toHaveLength(1);
  });

  it('결제일 전이면 대상이 아니다', () => {
    expect(pendingAutoRecords([make()], new Date(2026, 6, 4))).toHaveLength(0);
  });

  it('이번 달에 이미 기록됐으면 건너뛴다', () => {
    const items = [make({ lastRecordedMonth: '2026-07' })];

    expect(pendingAutoRecords(items, new Date(2026, 6, 10))).toHaveLength(0);
  });

  it('지난달에 기록된 건 이번 달에 다시 대상이 된다', () => {
    const items = [make({ lastRecordedMonth: '2026-06' })];

    expect(pendingAutoRecords(items, new Date(2026, 6, 10))).toHaveLength(1);
  });

  it('autoRecord가 꺼져 있으면 대상이 아니다', () => {
    expect(pendingAutoRecords([make({ autoRecord: false })], new Date(2026, 6, 10))).toHaveLength(0);
  });

  it('거래 날짜는 오늘이 아니라 결제일로 찍힌다', () => {
    const [pending] = pendingAutoRecords([make()], new Date(2026, 6, 20));

    expect(pending.transaction.date).toBe('2026-07-05');
  });

  it('말일이 없는 달은 그 달 마지막 날로 당겨 찍는다', () => {
    const [pending] = pendingAutoRecords([make({ cycleDay: 31 })], new Date(2026, 1, 28));

    expect(pending.transaction.date).toBe('2026-02-28');
  });

  it('고정지출 내용이 그대로 거래로 옮겨진다', () => {
    const [pending] = pendingAutoRecords([make()], new Date(2026, 6, 10));

    expect(pending.transaction).toMatchObject({
      type: 'expense',
      amount: 17_000,
      categoryId: 'subscription',
      paymentMethodId: 'shinhan',
      merchant: '넷플릭스',
      autoRecorded: true,
    });
  });

  it('여러 건 중 조건에 맞는 것만 고른다', () => {
    const items = [
      make({ id: 'a', cycleDay: 1 }),
      make({ id: 'b', cycleDay: 25 }),
      make({ id: 'c', cycleDay: 3, lastRecordedMonth: '2026-07' }),
    ];

    expect(pendingAutoRecords(items, new Date(2026, 6, 10)).map((p) => p.recurringId)).toEqual(['a']);
  });
});
