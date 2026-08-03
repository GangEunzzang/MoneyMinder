import { toAppCategoryId } from '@/entities/category/serverCode';
import type { Transaction } from '@/entities/transaction/model';
import type { ServerTransaction } from '@/shared/lib/api';

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
