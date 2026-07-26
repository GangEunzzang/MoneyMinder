import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type LedgerTransaction = {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  merchant: string;
  dateLabel: string;
};

type LedgerState = {
  budget: number;
  spent: number;
  income: number;
  currentStreak: number;
  noSpendDays: number;
  hasExpenseToday: boolean;
  transactions: LedgerTransaction[];
};

const STORAGE_KEY = 'moneyminder.ledger.v1';
let nextId = 5;
let state: LedgerState = {
  budget: 1_200_000,
  spent: 642_000,
  income: 2_600_000,
  currentStreak: 12,
  noSpendDays: 15,
  hasExpenseToday: false,
  transactions: [
    { id: 1, type: 'expense', amount: 6_100, category: '카페·간식', merchant: '스타벅스', dateLabel: '8월 6일 목요일' },
    { id: 2, type: 'expense', amount: 8_500, category: '식비', merchant: '김밥천국', dateLabel: '8월 4일 화요일' },
    { id: 3, type: 'expense', amount: 1_550, category: '교통', merchant: '지하철', dateLabel: '8월 4일 화요일' },
    { id: 4, type: 'income', amount: 2_600_000, category: '급여', merchant: '급여', dateLabel: '8월 1일 금요일' },
  ],
};

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => state;

const emit = () => listeners.forEach((listener) => listener());
const isLedgerState = (value: unknown): value is LedgerState => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<LedgerState>;

  return (
    typeof candidate.budget === 'number' &&
    typeof candidate.spent === 'number' &&
    typeof candidate.income === 'number' &&
    typeof candidate.currentStreak === 'number' &&
    typeof candidate.noSpendDays === 'number' &&
    typeof candidate.hasExpenseToday === 'boolean' &&
    Array.isArray(candidate.transactions)
  );
};

const hydratePromise = AsyncStorage.getItem(STORAGE_KEY)
  .then((saved) => {
    if (!saved) return;
    const parsed: unknown = JSON.parse(saved);
    if (!isLedgerState(parsed)) return;

    state = parsed;
    nextId = Math.max(0, ...state.transactions.map((transaction) => transaction.id)) + 1;
    emit();
  })
  .catch(() => undefined);

export async function addTransaction(input: Omit<LedgerTransaction, 'id'>) {
  await hydratePromise;
  const isFirstExpenseToday = input.type === 'expense' && input.dateLabel === '오늘' && !state.hasExpenseToday;
  const transaction = { ...input, id: nextId };
  const nextState: LedgerState = {
    ...state,
    spent: state.spent + (input.type === 'expense' ? input.amount : 0),
    income: state.income + (input.type === 'income' ? input.amount : 0),
    currentStreak: isFirstExpenseToday ? 0 : state.currentStreak,
    hasExpenseToday: state.hasExpenseToday || isFirstExpenseToday,
    transactions: [transaction, ...state.transactions],
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  nextId += 1;
  state = nextState;
  emit();
}

export function useLedger() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const formatWon = (amount: number) => amount.toLocaleString('ko-KR');
