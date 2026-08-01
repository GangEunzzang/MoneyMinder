import { isExpense, type Transaction } from '@/entities/transaction/model';
import { shiftMonth } from '@/shared/lib/format';

export type Pace = {
  /** 이번 달 1일부터 오늘까지 쓴 돈. */
  current: number;
  /** 지난달 1일부터 같은 날짜까지 쓴 돈. */
  previous: number;
  /** 지난달 같은 기간보다 덜 쓴 금액. 음수면 더 썼다는 뜻. */
  saved: number;
};

/**
 * 진행 중인 달을 지난달 "전체"와 비교하면 항상 덜 쓴 것처럼 보인다.
 * 25일에 서 있으면 지난달도 25일까지만 놓고 견줘야 말이 된다.
 */
export function monthPace(txns: readonly Transaction[], ym: string, today: Date): Pace {
  const day = today.getDate();
  const prev = shiftMonth(ym, -1);
  // 지난달이 짧으면 (3월 31일 → 2월) 말일까지만 본다.
  const [py, pm] = prev.split('-').map(Number);
  const prevLast = new Date(py, pm, 0).getDate();
  const prevDay = Math.min(day, prevLast);

  const sum = (prefix: string, until: number) =>
    txns.reduce((total, t) => {
      if (!isExpense(t) || !t.date.startsWith(prefix)) return total;

      return Number(t.date.slice(8)) <= until ? total + t.amount : total;
    }, 0);

  const current = sum(ym, day);
  const previous = sum(prev, prevDay);

  return { current, previous, saved: previous - current };
}
