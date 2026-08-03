import { toAppCategoryId } from '@/entities/category/serverCode';
import type { Recurring } from '@/entities/recurring/model';
import type { ServerRecurring } from '@/shared/lib/api';

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
