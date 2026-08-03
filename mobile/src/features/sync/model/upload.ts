import { toServerCategoryCode } from '@/entities/category/serverCode';
import { toServerPeriod } from '@/entities/mission/serverAdapter';
import { useMissions } from '@/entities/mission/store';
import { toAppPaymentMethod } from '@/entities/payment-method/serverAdapter';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { toAppRecurring } from '@/entities/recurring/serverAdapter';
import { useRecurring } from '@/entities/recurring/store';
import { toAppTransaction } from '@/entities/transaction/serverAdapter';
import { useLedger } from '@/entities/transaction/store';
import { api } from '@/shared/lib/api';

/**
 * 로그인 전에 로컬에만 쌓인 것을 서버로 올린다. 서버가 비어 있을 때만 한다 —
 * 이미 서버에 기록이 있으면 그쪽이 진실이고, 여기서 올리면 같은 것이 두 벌 된다.
 *
 * 결제수단을 먼저 올려야 한다. 거래가 그 id 를 물고 가기 때문이다.
 */
export async function uploadLocalData(): Promise<void> {
  const methodIdMap = await uploadPaymentMethods();

  await Promise.all([uploadTransactions(methodIdMap), uploadRecurrings(methodIdMap)]);
  await uploadMissions();
  await uploadBudget();
}

async function uploadPaymentMethods(): Promise<Map<string, number>> {
  const methods = usePaymentMethods.getState().methods;
  const idMap = new Map<string, number>();

  for (const method of methods) {
    const saved = await api.paymentMethods
      .create({
        name: method.name,
        kind: method.kind.toUpperCase() as 'CARD' | 'CASH' | 'ACCOUNT',
        color: method.color,
        billingDay: method.kind === 'card' ? method.billingDay : null,
      })
      .catch(() => null);

    if (saved) idMap.set(method.id, saved.paymentMethodId);
  }

  if (idMap.size > 0) {
    const fresh = await api.paymentMethods.list().catch(() => []);
    if (fresh.length > 0) usePaymentMethods.setState({ methods: fresh.map(toAppPaymentMethod) });
  }

  return idMap;
}

async function uploadTransactions(methodIdMap: Map<string, number>): Promise<void> {
  const transactions = useLedger.getState().transactions;
  if (transactions.length === 0) return;

  // 오래된 것부터 올려야 서버 id 순서가 시간 순서와 어긋나지 않는다.
  for (const transaction of [...transactions].reverse()) {
    await api.transactions
      .create({
        amount: transaction.amount,
        categoryCode: toServerCategoryCode(transaction.categoryId),
        transactionDate: transaction.date,
        memo: transaction.memo,
        merchant: transaction.merchant,
        paymentMethodId:
          transaction.paymentMethodId == null
            ? null
            : (methodIdMap.get(transaction.paymentMethodId) ?? null),
      })
      .catch(() => null);
  }

  const fresh = await api.transactions.list().catch(() => []);
  useLedger.setState({ transactions: fresh.map(toAppTransaction) });
}

async function uploadRecurrings(methodIdMap: Map<string, number>): Promise<void> {
  const items = useRecurring.getState().items;
  if (items.length === 0) return;

  for (const item of items) {
    await api.recurrings
      .create({
        name: item.name,
        amount: item.amount,
        cycleDay: item.cycleDay,
        categoryCode: toServerCategoryCode(item.categoryId),
        paymentMethodId:
          item.paymentMethodId == null ? null : (methodIdMap.get(item.paymentMethodId) ?? null),
        autoRecord: item.autoRecord,
        remindBeforeDays: item.remindBeforeDays,
      })
      .catch(() => null);
  }

  const fresh = await api.recurrings.list().catch(() => []);
  if (fresh.length > 0) useRecurring.setState({ items: fresh.map(toAppRecurring) });
}

async function uploadMissions(): Promise<void> {
  const active = useMissions.getState().active;
  const serverIds: Record<string, number> = {};

  for (const mission of active) {
    const saved = await api.missions
      .start({
        missionCode: mission.id,
        target: mission.target,
        period: toServerPeriod(mission.period),
      })
      .catch(() => null);

    if (saved) serverIds[mission.id] = saved.missionId;
  }

  if (Object.keys(serverIds).length > 0) useMissions.setState({ serverIds });
}

async function uploadBudget(): Promise<void> {
  const { budget, categoryBudgets } = useLedger.getState();
  const now = new Date();
  const budgetIds: Record<string, number> = {};

  if (budget > 0) {
    const saved = await api.budgets
      .create(now.getFullYear(), now.getMonth() + 1, budget, null)
      .catch(() => null);

    if (saved) budgetIds.__total__ = saved.budgetId;
  }

  for (const [categoryId, amount] of Object.entries(categoryBudgets)) {
    const saved = await api.budgets
      .create(now.getFullYear(), now.getMonth() + 1, amount, toServerCategoryCode(categoryId))
      .catch(() => null);

    if (saved) budgetIds[categoryId] = saved.budgetId;
  }

  if (Object.keys(budgetIds).length > 0) useLedger.setState({ budgetIds });
}
