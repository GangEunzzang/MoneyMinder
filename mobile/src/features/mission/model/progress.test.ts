import { findMission, type MissionSpec } from '@/entities/mission/model';
import type { Transaction } from '@/entities/transaction/model';

import { missionProgress, remainingLabel } from './progress';

const CAFE = findMission('cafe-diet') as MissionSpec;
const NO_SPEND = findMission('no-spend') as MissionSpec;
const BUDGET = findMission('budget-keep') as MissionSpec;
const DAILY = findMission('daily-budget') as MissionSpec;

function spend(date: string, amount: number, categoryId = 'cafe'): Transaction {
  return {
    id: `${date}-${amount}-${categoryId}`,
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

// 2026-07-29는 수요일 — 주 시작은 7/27(월)
const WED = new Date(2026, 6, 29);

describe('missionProgress · 횟수형', () => {
  it('이번 주 해당 카테고리 결제 건수를 센다', () => {
    const txns = [spend('2026-07-27', 6_100), spend('2026-07-29', 5_800)];

    expect(missionProgress(CAFE, { target: 5 }, txns, WED)).toMatchObject({
      done: 2,
      target: 5,
      ceiling: true,
      achieved: true,
    });
  });

  it('지난주 결제는 세지 않는다', () => {
    expect(missionProgress(CAFE, { target: 5 }, [spend('2026-07-26', 6_100)], WED).done).toBe(0);
  });

  it('다른 카테고리는 세지 않는다', () => {
    const txns = [spend('2026-07-28', 9_000, 'food')];

    expect(missionProgress(CAFE, { target: 5 }, txns, WED).done).toBe(0);
  });

  it('상한을 넘으면 달성 실패다', () => {
    const txns = Array.from({ length: 6 }, (_, i) => spend(`2026-07-2${7 + (i % 3)}`, 5_000));

    expect(missionProgress(CAFE, { target: 5 }, txns, WED).achieved).toBe(false);
  });
});

describe('missionProgress · 무지출', () => {
  it('이번 주 무지출 일수를 센다', () => {
    const txns = [spend('2026-07-27', 6_100)];
    const p = missionProgress(NO_SPEND, { target: 4 }, txns, WED);

    expect(p.done).toBe(2);
    expect(p.ceiling).toBe(false);
  });

  it('목표를 채우면 달성이다', () => {
    expect(missionProgress(NO_SPEND, { target: 2 }, [], WED).achieved).toBe(true);
  });
});

describe('missionProgress · 금액형', () => {
  it('예산 지키기는 이번 달 전체 지출을 본다', () => {
    const txns = [spend('2026-07-01', 400_000, 'food'), spend('2026-06-01', 900_000, 'food')];

    expect(missionProgress(BUDGET, { target: 1_200_000 }, txns, WED)).toMatchObject({
      done: 400_000,
      achieved: true,
    });
  });

  it('하루 예산은 오늘 지출만 본다', () => {
    const txns = [spend('2026-07-29', 12_000), spend('2026-07-28', 30_000)];

    expect(missionProgress(DAILY, { target: 10_000 }, txns, WED)).toMatchObject({
      done: 12_000,
      achieved: false,
    });
  });

  it('게이지 비율은 1을 넘지 않는다', () => {
    expect(missionProgress(DAILY, { target: 10_000 }, [spend('2026-07-29', 90_000)], WED).ratio).toBe(1);
  });
});

describe('remainingLabel', () => {
  it('상한형은 남은 몫을 말한다', () => {
    const p = missionProgress(CAFE, { target: 5 }, [spend('2026-07-27', 6_100)], WED);

    expect(remainingLabel(CAFE, p)).toBe('4잔 남았어요');
  });

  it('상한을 넘으면 넘었다고 말한다', () => {
    const txns = Array.from({ length: 6 }, (_, i) => spend(`2026-07-2${7 + (i % 3)}`, 5_000));

    expect(remainingLabel(CAFE, missionProgress(CAFE, { target: 5 }, txns, WED))).toBe(
      '목표를 넘었어요',
    );
  });

  it('하한형은 더 해야 할 몫을 말한다', () => {
    const p = missionProgress(NO_SPEND, { target: 4 }, [spend('2026-07-27', 6_100)], WED);

    expect(remainingLabel(NO_SPEND, p)).toBe('2일 더 하면 달성');
  });

  it('금액형은 원 단위로 말한다', () => {
    const p = missionProgress(BUDGET, { target: 1_200_000 }, [spend('2026-07-01', 200_000)], WED);

    expect(remainingLabel(BUDGET, p)).toBe('1,000,000원 남았어요');
  });
});
