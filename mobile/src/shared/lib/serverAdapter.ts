/**
 * 서버 모델 → 앱 모델. 둘은 같지 않다.
 * 서버 카테고리는 코드(DC006)와 이름만 갖고, 아이콘·색은 앱이 정한다.
 */

import type { ActiveMission, MissionId, MissionPeriod } from '@/entities/mission/model';
import type { PaymentMethod } from '@/entities/payment-method/model';
import type { Recurring } from '@/entities/recurring/model';
import type { Transaction } from '@/entities/transaction/model';
import type {
  ServerMission,
  ServerPaymentMethod,
  ServerRecurring,
  ServerTransaction,
} from '@/shared/lib/api';
import type { ColorName } from '@/shared/theme';

/** 서버 기본 카테고리 코드 ↔ 앱 카테고리. 서버엔 아이콘·색이 없어 여기서 붙인다. */
const CODE_TO_APP: Record<string, string> = {
  DC001: 'salary',
  DC002: 'salary',
  DC003: 'salary',
  DC004: 'salary',
  DC005: 'etc',
  DC006: 'food',
  DC007: 'transport',
  DC008: 'living',
  DC009: 'telecom',
  DC010: 'living',
  DC011: 'etc',
  DC012: 'culture',
  DC013: 'beauty',
  DC014: 'health',
  DC015: 'culture',
  DC016: 'etc',
  DC017: 'etc',
};

const APP_TO_CODE: Record<string, string> = {
  salary: 'DC001',
  food: 'DC006',
  cafe: 'DC006',
  transport: 'DC007',
  living: 'DC008',
  telecom: 'DC009',
  shopping: 'DC010',
  culture: 'DC012',
  beauty: 'DC013',
  health: 'DC014',
  education: 'DC012',
  travel: 'DC015',
  subscription: 'DC009',
  etc: 'DC017',
};

/**
 * 서버에서 온 것은 id 가 숫자 문자열이다. 로컬에서 만든 것(`abc-1`)과 이걸로 가른다 —
 * 서버에 없는 행을 지우거나 고치려 들면 404 가 난다.
 */
export function toServerId(id: string): number | null {
  const parsed = Number(id);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function toAppCategoryId(categoryCode: string): string {
  return CODE_TO_APP[categoryCode] ?? 'etc';
}

export function toServerCategoryCode(appCategoryId: string): string {
  return APP_TO_CODE[appCategoryId] ?? 'DC017';
}

export function toAppTransaction(server: ServerTransaction): Transaction {
  return {
    id: String(server.accountId),
    type: server.categoryType === 'INCOME' ? 'income' : 'expense',
    amount: server.amount,
    categoryId: toAppCategoryId(server.categoryCode),
    paymentMethodId: server.paymentMethodId == null ? null : String(server.paymentMethodId),
    merchant: server.merchant ?? '',
    memo: server.memo ?? '',
    date: server.transactionDate,
    autoRecorded: server.autoRecorded,
  };
}

const KIND_COLOR: Record<string, ColorName> = {
  CARD: 'violet',
  CASH: 'mint',
  ACCOUNT: 'peach',
};

export function toAppPaymentMethod(server: ServerPaymentMethod): PaymentMethod {
  return {
    id: String(server.paymentMethodId),
    name: server.name,
    kind: server.kind.toLowerCase() as PaymentMethod['kind'],
    color: (server.color as ColorName) ?? KIND_COLOR[server.kind] ?? 'violet',
    billingDay: server.billingDay,
  };
}

export function toAppRecurring(server: ServerRecurring): Recurring {
  return {
    id: String(server.recurringId),
    name: server.name,
    amount: server.amount,
    cycleDay: server.cycleDay,
    categoryId: toAppCategoryId(server.categoryCode),
    paymentMethodId: server.paymentMethodId == null ? null : String(server.paymentMethodId),
    autoRecord: server.autoRecord,
    remindBeforeDays: server.remindBeforeDays,
    lastRecordedMonth: null,
  };
}

const PERIOD_TO_APP: Record<ServerMission['period'], MissionPeriod> = {
  WEEK: 'week',
  MONTH: 'month',
  FOREVER: 'forever',
};

export function toServerPeriod(period: MissionPeriod): ServerMission['period'] {
  return period === 'week' ? 'WEEK' : period === 'month' ? 'MONTH' : 'FOREVER';
}

export function toAppMission(server: ServerMission): ActiveMission {
  return {
    id: server.missionCode as MissionId,
    target: server.target,
    period: PERIOD_TO_APP[server.period],
    startedOn: server.startedOn,
  };
}
