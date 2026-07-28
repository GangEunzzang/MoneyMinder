import { create } from 'zustand';

import { filterMonth, type Transaction } from '@/entities/transaction/model';
import { monthKey, shiftMonth } from '@/shared/lib/format';

export type Range = 'month' | 'prevMonth' | 'quarter' | 'all';
export type TypeFilter = 'all' | 'expense' | 'income';

export type Filter = {
  range: Range;
  type: TypeFilter;
  categoryIds: string[];
  methodIds: string[];
};

export const RANGE_LABEL: Record<Range, string> = {
  month: '이번 달',
  prevMonth: '지난 달',
  quarter: '최근 3개월',
  all: '전체',
};

export const EMPTY: Filter = { range: 'month', type: 'all', categoryIds: [], methodIds: [] };

type State = { filter: Filter };
type Actions = { apply: (f: Filter) => void; reset: () => void };

/**
 * 내역 필터는 저장하지 않는다. 앱을 다시 열었을 때 지난번 필터가 걸려 있으면
 * 기록이 사라진 것처럼 보인다.
 */
export const useFilter = create<State & Actions>((set) => ({
  filter: EMPTY,
  apply: (filter) => set({ filter }),
  reset: () => set({ filter: EMPTY }),
}));

export function isDefault(f: Filter): boolean {
  return (
    f.range === EMPTY.range &&
    f.type === EMPTY.type &&
    f.categoryIds.length === 0 &&
    f.methodIds.length === 0
  );
}

/** 기본값에서 몇 가지가 달라졌는지. 배지 숫자로 쓴다. */
export function activeCount(f: Filter): number {
  return (
    (f.range !== EMPTY.range ? 1 : 0) +
    (f.type !== EMPTY.type ? 1 : 0) +
    (f.categoryIds.length > 0 ? 1 : 0) +
    (f.methodIds.length > 0 ? 1 : 0)
  );
}

function inRange(t: Transaction, range: Range, ym: string, today: Date): boolean {
  if (range === 'all') return true;
  if (range === 'month') return t.date.startsWith(ym);
  if (range === 'prevMonth') return t.date.startsWith(shiftMonth(monthKey(today), -1));

  return t.date >= `${shiftMonth(monthKey(today), -2)}-01`;
}

export function applyFilter(
  txns: readonly Transaction[],
  f: Filter,
  ym: string,
  today: Date,
): Transaction[] {
  return txns.filter((t) => {
    if (!inRange(t, f.range, ym, today)) return false;
    if (f.type !== 'all' && t.type !== f.type) return false;
    if (f.categoryIds.length > 0 && !f.categoryIds.includes(t.categoryId)) return false;
    if (f.methodIds.length > 0 && (t.paymentMethodId == null || !f.methodIds.includes(t.paymentMethodId)))
      return false;

    return true;
  });
}

export { filterMonth };
