/**
 * 백엔드 호출. 앱은 로컬 저장으로도 완결되므로, 서버가 없거나 죽어 있어도
 * 화면이 깨지지 않게 실패는 호출한 쪽이 삼킬 수 있는 형태로 던진다.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

type ApiEnvelope<T> = { code: number; message: string; data: T };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as ApiEnvelope<T>) : ({} as ApiEnvelope<T>);

  if (!response.ok) throw new ApiError(response.status, body.message ?? response.statusText);

  return body.data;
}

/* 서버 응답 모양 — 앱 모델과 다르므로 그대로 두고 어댑터에서 옮긴다. */

export type ServerCategory = {
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  categoryType: 'INCOME' | 'EXPENSE' | 'ETC';
  description: string;
  isCustom: boolean;
};

export type ServerTransaction = {
  accountId: number;
  amount: number;
  transactionDate: string;
  memo: string | null;
  paymentMethodId: number | null;
  merchant: string | null;
  autoRecorded: boolean;
  categoryCode: string;
  categoryName: string;
  categoryType: 'INCOME' | 'EXPENSE' | 'ETC';
};

export type ServerPaymentMethod = {
  paymentMethodId: number;
  name: string;
  kind: 'CARD' | 'CASH' | 'ACCOUNT';
  color: string | null;
  billingDay: number | null;
  sortOrder: number;
};

export type ServerRecurring = {
  recurringId: number;
  name: string;
  amount: number;
  cycleDay: number;
  categoryCode: string;
  paymentMethodId: number | null;
  autoRecord: boolean;
  remindBeforeDays: number;
  nextBillingDate: string;
  daysUntilBilling: number;
  settledThisMonth: boolean;
};

export type ServerMission = {
  missionId: number;
  missionCode: string;
  target: number;
  period: 'WEEK' | 'MONTH' | 'FOREVER';
  startedOn: string;
  status: 'ACTIVE' | 'STOPPED';
  currentPeriodKey: string;
};

export type ServerBudget = {
  budgetId: number;
  year: number;
  month: number;
  amount: number;
  /** 없으면 그 달 전체 한도다. */
  categoryCode: string | null;
  categoryName: string | null;
};

export type TransactionInput = {
  amount: number;
  categoryCode: string;
  transactionDate: string;
  memo: string;
  merchant: string;
  paymentMethodId: number | null;
};

export type CategoryInput = {
  categoryName: string;
  categoryType: 'INCOME' | 'EXPENSE' | 'ETC';
  description: string;
};

export type PaymentMethodInput = {
  name: string;
  kind: 'CARD' | 'CASH' | 'ACCOUNT';
  color: string | null;
  billingDay: number | null;
};

export type RecurringInput = {
  name: string;
  amount: number;
  cycleDay: number;
  categoryCode: string;
  paymentMethodId: number | null;
  autoRecord: boolean;
  remindBeforeDays: number;
};

export type MissionInput = {
  missionCode: string;
  target: number;
  period: 'WEEK' | 'MONTH' | 'FOREVER';
};

export const api = {
  signup: (email: string, name: string, password: string) =>
    request<void>('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    }),

  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string }>('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  categories: {
    list: () => request<ServerCategory[]>('/api/v1/categories'),
    create: (input: CategoryInput) =>
      request<ServerCategory>('/api/v1/categories', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: number, input: CategoryInput) =>
      request<ServerCategory>(`/api/v1/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    remove: (id: number) => request<void>(`/api/v1/categories/${id}`, { method: 'DELETE' }),
  },

  transactions: {
    list: () => request<ServerTransaction[]>('/api/v1/account-books'),
    create: (input: TransactionInput) =>
      request<ServerTransaction>('/api/v1/account-books', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: number, input: TransactionInput) =>
      request<ServerTransaction>(`/api/v1/account-books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    remove: (id: number) => request<void>(`/api/v1/account-books/${id}`, { method: 'DELETE' }),
  },

  paymentMethods: {
    list: () => request<ServerPaymentMethod[]>('/api/v1/payment-methods'),
    create: (input: PaymentMethodInput) =>
      request<ServerPaymentMethod>('/api/v1/payment-methods', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: number, input: PaymentMethodInput) =>
      request<ServerPaymentMethod>(`/api/v1/payment-methods/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    remove: (id: number) => request<void>(`/api/v1/payment-methods/${id}`, { method: 'DELETE' }),
  },

  recurrings: {
    list: () => request<ServerRecurring[]>('/api/v1/recurrings'),
    create: (input: RecurringInput) =>
      request<ServerRecurring>('/api/v1/recurrings', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: number, input: RecurringInput) =>
      request<ServerRecurring>(`/api/v1/recurrings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    remove: (id: number) => request<void>(`/api/v1/recurrings/${id}`, { method: 'DELETE' }),
    runAutoRecord: () =>
      request<ServerRecurring[]>('/api/v1/recurrings/auto-record', { method: 'POST' }),
  },

  missions: {
    list: () => request<ServerMission[]>('/api/v1/missions'),
    start: (input: MissionInput) =>
      request<ServerMission>('/api/v1/missions', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: number, target: number, period: MissionInput['period']) =>
      request<ServerMission>(`/api/v1/missions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ target, period }),
      }),
    stop: (id: number) => request<void>(`/api/v1/missions/${id}`, { method: 'DELETE' }),
  },

  budgets: {
    list: (year: number, month: number) =>
      request<ServerBudget[]>(`/api/v1/budgets?year=${year}&month=${month}`),
    create: (year: number, month: number, amount: number, categoryCode: string | null) =>
      request<ServerBudget>('/api/v1/budgets', {
        method: 'POST',
        body: JSON.stringify({ year: String(year), month: String(month), amount, categoryCode }),
      }),
    update: (id: number, amount: number) =>
      request<ServerBudget>(`/api/v1/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
      }),
  },

  monthSummary: (year: number, month: number) =>
    request<{ monthTotalIncome: number; monthTotalExpense: number }>(
      `/api/v1/account-books/summaries/monthly?year=${year}&month=${month}`,
    ),
};
