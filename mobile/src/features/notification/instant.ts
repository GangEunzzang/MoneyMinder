import { useAppState } from '@/entities/app/store';
import { filterMonth, monthKey, sumExpense, type Transaction } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { wonUnit } from '@/shared/lib/format';
import { notifyNow } from '@/shared/lib/notifications';

/** 이 금액을 넘으면 "큰 지출"로 본다. 한 끼·교통비와 섞이지 않을 선. */
const BIG_SPEND = 100_000;

/**
 * 기록하는 순간 판정되는 알림들 ([[DECISIONS#BD12]]).
 * 예약이 필요 없다 — 지금 판정할 수 있는 것을 미래에 다시 계산할 이유가 없다.
 */
export async function notifyAfterRecord(recorded: Transaction): Promise<void> {
  const { notify } = useAppState.getState();

  if (notify.bigSpend && recorded.type === 'expense' && recorded.amount >= BIG_SPEND) {
    await notifyNow({
      title: '큰 지출이 기록됐어요',
      body: `${wonUnit(recorded.amount)} · 예산을 다시 확인해볼까요?`,
      route: '/monthly',
    });
  }

  if (notify.budgetOver) await notifyBudgetOver();
}

/**
 * 예산 초과는 그 달 내내 참이라, 한 번 알린 달은 다시 알리지 않는다.
 * 화면의 ConfirmDialog 와 같은 기준(budgetAlerted)을 쓴다.
 */
async function notifyBudgetOver(): Promise<void> {
  const { budget, transactions } = useLedger.getState();
  if (budget <= 0) return;

  const ym = monthKey(new Date());
  const { budgetAlerted, alertBudget } = useAppState.getState();
  if (budgetAlerted.includes(ym)) return;

  const spent = sumExpense(filterMonth(transactions, ym));
  if (spent <= budget) return;

  alertBudget(ym);
  await notifyNow({
    title: '이번 달 예산을 넘었어요',
    body: `${wonUnit(spent - budget)} 초과 · 무지출로 균형을 맞춰볼까요?`,
    route: '/monthly',
  });
}

export async function notifyMissionDone(missionTitle: string): Promise<void> {
  if (!useAppState.getState().notify.missionDone) return;

  await notifyNow({
    title: '미션 완주!',
    body: `${missionTitle} 목표를 채웠어요`,
    route: '/mission',
  });
}

export async function notifyBadge(badgeTitle: string): Promise<void> {
  if (!useAppState.getState().notify.badge) return;

  await notifyNow({
    title: '새 배지를 받았어요',
    body: badgeTitle,
    route: '/mission',
  });
}
