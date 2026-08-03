import { useEffect } from 'react';

import { toAppMission } from '@/entities/mission/serverAdapter';
import { useMissions } from '@/entities/mission/store';
import { toAppPaymentMethod } from '@/entities/payment-method/serverAdapter';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { toAppRecurring } from '@/entities/recurring/serverAdapter';
import { useRecurring } from '@/entities/recurring/store';
import { useSession } from '@/entities/session/store';
import { toAppTransaction } from '@/entities/transaction/serverAdapter';
import { useLedger } from '@/entities/transaction/store';
import { uploadLocalData } from '@/features/sync/model/upload';
import { api, ApiError, setAccessToken, type ServerBudget } from '@/shared/lib/api';

/** 데모 계정. 로그인 화면이 실제 인증을 하게 되면 여기는 사라진다. */
const DEMO = { email: 'demo@moneyminder.com', name: '데모', password: 'demo1234' };

/**
 * 앱을 열 때 서버와 한 번 맞춘다. 서버가 없으면 로컬 데이터로 계속 간다 —
 * 연결 실패가 화면을 막지 않는 것이 지금 구조의 전제다.
 */
export function useServerSync(): void {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      useSession.getState().setConnecting();

      try {
        // 이미 있는 계정이면 무엇이 오든 무시하고 로그인으로 간다.
        await api.signup(DEMO.email, DEMO.name, DEMO.password).catch(() => undefined);

        const { accessToken } = await api.login(DEMO.email, DEMO.password);
        if (cancelled) return;

        setAccessToken(accessToken);

        const now = new Date();
        const [transactions, paymentMethods, recurrings, missions, budgets] = await Promise.all([
          api.transactions.list(),
          api.paymentMethods.list(),
          api.recurrings.list(),
          api.missions.list(),
          api.budgets.list(now.getFullYear(), now.getMonth() + 1),
        ]);
        if (cancelled) return;

        const serverEmpty =
          transactions.length === 0 &&
          paymentMethods.length === 0 &&
          recurrings.length === 0 &&
          missions.length === 0 &&
          budgets.length === 0;

        // 로그인 전에 로컬에만 쌓인 것이 있으면 그것부터 올린다. 안 하면 첫 로그인에 기록이 사라진 것처럼 보인다.
        if (serverEmpty) {
          await uploadLocalData();
          if (cancelled) return;

          useSession.getState().setConnected(DEMO.email, new Date().toISOString());

          return;
        }

        useLedger.setState({ transactions: transactions.map(toAppTransaction) });

        if (paymentMethods.length > 0) {
          usePaymentMethods.setState({ methods: paymentMethods.map(toAppPaymentMethod) });
        }

        if (recurrings.length > 0) {
          useRecurring.setState({ items: recurrings.map(toAppRecurring) });
        }

        if (missions.length > 0) {
          useMissions.setState({
            active: missions.filter((m) => m.status === 'ACTIVE').map(toAppMission),
            serverIds: Object.fromEntries(missions.map((m) => [m.missionCode, m.missionId])),
          });
        }

        applyBudgets(budgets);

        useSession.getState().setConnected(DEMO.email, new Date().toISOString());
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof ApiError
            ? `${error.status} ${error.message}`
            : error instanceof Error
              ? error.message
              : '알 수 없는 오류';

        useSession.getState().setOffline(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}

/** 카테고리 없는 행이 그 달 총액이고, 나머지가 카테고리별 한도다. */
function applyBudgets(budgets: ServerBudget[]): void {
  if (budgets.length === 0) return;

  const total = budgets.find((b) => b.categoryCode == null);
  const byCategory = budgets.filter((b) => b.categoryCode != null);

  useLedger.setState((s) => ({
    budget: total ? total.amount : s.budget,
    budgetIds: Object.fromEntries([
      ...(total ? [['__total__', total.budgetId] as const] : []),
      ...byCategory.map((b) => [b.categoryCode as string, b.budgetId] as const),
    ]),
  }));
}
