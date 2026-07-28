import { findMission, type ActiveMission } from '@/entities/mission/model';
import type { Transaction } from '@/entities/transaction/model';

import { completion, completionStreak, lastClosedDay, nextTarget, savedByMission } from './complete';

const cafe = findMission('cafe-diet')!;
const budget = findMission('budget-keep')!;

let seq = 0;

function txn(date: string, amount: number, categoryId = 'cafe'): Transaction {
  seq += 1;

  return {
    id: `t${seq}`,
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

/** 2026-07-27(월) ~ 08-02(일) 이 "이번 주", 07-20~07-26 이 직전 회차. */
const TODAY = new Date(2026, 6, 29);

function active(patch: Partial<ActiveMission> = {}): ActiveMission {
  return { id: 'cafe-diet', target: 5, period: 'week', startedOn: '2026-07-01', ...patch };
}

describe('lastClosedDay', () => {
  it('주간 미션은 이번 주 월요일의 하루 전에서 끝난다', () => {
    expect(lastClosedDay('week', TODAY)?.getDate()).toBe(26);
  });

  it('월간 미션은 지난달 말일에서 끝난다', () => {
    const end = lastClosedDay('month', TODAY);

    expect(end?.getMonth()).toBe(5);
    expect(end?.getDate()).toBe(30);
  });

  it('기한 없는 미션은 닫히는 회차가 없다', () => {
    expect(lastClosedDay('forever', TODAY)).toBeNull();
  });
});

describe('completion', () => {
  it('목표 안에 들어온 지난주는 완주로 본다', () => {
    const txns = [txn('2026-07-21', 5000), txn('2026-07-23', 4000)];
    const result = completion(cafe, active(), txns, TODAY);

    expect(result?.done).toBe(2);
    expect(result?.target).toBe(5);
    expect(result?.periodKey).toBe('2026-07-20');
  });

  it('목표를 넘긴 회차는 축하하지 않는다', () => {
    const txns = Array.from({ length: 6 }, (_, i) => txn(`2026-07-2${i}`, 5000));

    expect(completion(cafe, active(), txns, TODAY)).toBeNull();
  });

  it('미션 시작 전에 열린 회차는 성적표로 치지 않는다', () => {
    expect(completion(cafe, active({ startedOn: '2026-07-27' }), [], TODAY)).toBeNull();
  });

  it('진행 중인 회차는 아직 성적표가 아니다 — 이번 주 지출은 세지 않는다', () => {
    const thisWeek = [txn('2026-07-28', 5000), txn('2026-07-29', 5000)];

    expect(completion(cafe, active(), thisWeek, TODAY)?.done).toBe(0);
  });

  it('회차 단위가 진행률 단위와 어긋나면 성적표를 내지 않는다', () => {
    expect(completion(cafe, active({ period: 'month' }), [], TODAY)).toBeNull();
  });

  it('무지출처럼 상한이 없는 미션은 완주 성적표가 없다', () => {
    const noSpend = findMission('no-spend')!;

    expect(completion(noSpend, active({ id: 'no-spend', period: 'week' }), [], TODAY)).toBeNull();
  });

  it('직전 회차 실적을 함께 돌려준다', () => {
    const txns = [txn('2026-07-21', 5000), txn('2026-07-14', 5000), txn('2026-07-15', 5000)];
    const result = completion(cafe, active(), txns, TODAY);

    expect(result?.done).toBe(1);
    expect(result?.previousDone).toBe(2);
  });

  it('첫 회차는 비교 대상이 없다', () => {
    const result = completion(cafe, active({ startedOn: '2026-07-20' }), [], TODAY);

    expect(result?.previousDone).toBeNull();
  });
});

describe('completionStreak', () => {
  it('연속 완주한 회차를 거슬러 센다', () => {
    const end = lastClosedDay('week', TODAY)!;

    expect(completionStreak(cafe, active(), [], end)).toBe(3);
  });

  it('실패한 회차에서 멈춘다', () => {
    // 07-13(월)~07-18(토) 한 주에 6잔 — 목표 5잔을 넘긴 회차.
    const failed = Array.from({ length: 6 }, (_, i) => txn(`2026-07-1${3 + i}`, 5000));
    const end = lastClosedDay('week', TODAY)!;

    expect(completionStreak(cafe, active(), failed, end)).toBe(1);
  });
});

describe('savedByMission', () => {
  it('금액 미션은 차액이 곧 아낀 돈이다', () => {
    expect(savedByMission(budget, 1_000_000, 900_000, [], TODAY)).toBe(100_000);
  });

  it('횟수 미션은 평균 단가를 곱한다', () => {
    const txns = [txn('2026-07-01', 4000), txn('2026-07-02', 5000), txn('2026-07-03', 6000)];

    expect(savedByMission(cafe, 5, 3, txns, TODAY)).toBe(10_000);
  });

  it('표본이 모자라면 금액을 말하지 않는다', () => {
    expect(savedByMission(cafe, 5, 3, [txn('2026-07-01', 4000)], TODAY)).toBeNull();
  });

  it('목표를 못 지켰으면 아낀 돈이 없다', () => {
    expect(savedByMission(budget, 1_000_000, 1_200_000, [], TODAY)).toBeNull();
  });
});

describe('nextTarget', () => {
  it('한 칸 조인 목표를 고른다', () => {
    expect(nextTarget(cafe, 5)).toBe(4);
  });

  it('더 낮출 곳이 없으면 지금 목표를 지킨다', () => {
    expect(nextTarget(cafe, 2)).toBe(2);
  });
});
