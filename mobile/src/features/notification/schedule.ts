import { useAppState } from '@/entities/app/store';
import { useMissions } from '@/entities/mission/store';
import type { Recurring } from '@/entities/recurring/model';
import { useRecurring } from '@/entities/recurring/store';
import { billingDate } from '@/entities/recurring/model';
import { hasPermission, cancelAll, scheduleAt, scheduleDaily, scheduleWeekly } from '@/shared/lib/notifications';
import { wonUnit } from '@/shared/lib/format';

/** 주간 리포트는 월요일 아침에 지난주를 돌아보게 한다. weekday 는 1(일)~7(토). */
const WEEKLY_REPORT_WEEKDAY = 2;
const WEEKLY_REPORT_HOUR = 9;

/**
 * 예약된 알림을 전부 지우고 지금 상태로 다시 건다 ([[DECISIONS#BD13]]).
 *
 * 개별로 취소·재예약하면 고정지출 금액을 바꿨는데 옛 알림이 남는 식의 어긋남이 생긴다.
 * 예약 건수가 적어(반복 2건 + 고정지출 수) 전량 재예약이 더 싸다.
 */
export async function rescheduleAll(): Promise<void> {
  await cancelAll();

  if (!(await hasPermission())) return;

  const { notify } = useAppState.getState();
  const { remind, remindHour } = useMissions.getState();
  const recurrings = useRecurring.getState().items;

  if (notify.noSpendRemind && remind) {
    await scheduleDaily(remindHour, {
      title: '오늘은 어땠나요?',
      body: '무지출로 마무리했다면 인증하고, 썼다면 3초만에 남겨보세요',
      route: '/add',
    });
  }

  if (notify.weekly) {
    await scheduleWeekly(WEEKLY_REPORT_WEEKDAY, WEEKLY_REPORT_HOUR, {
      title: '지난주 소비 리포트',
      body: '얼마나 아꼈는지 확인해보세요',
      route: '/monthly',
    });
  }

  for (const recurring of recurrings) {
    await scheduleRecurringReminder(recurring);
  }
}

/** 결제일 N일 전 오전에 한 번. 이미 지난 시각이면 예약하지 않는다. */
async function scheduleRecurringReminder(recurring: Recurring): Promise<void> {
  if (recurring.remindBeforeDays === 0) return;

  const today = new Date();
  const thisMonth = billingDate(today.getFullYear(), today.getMonth(), recurring.cycleDay);
  const target = thisMonth.getTime() > today.getTime()
    ? thisMonth
    : billingDate(today.getFullYear(), today.getMonth() + 1, recurring.cycleDay);

  const remindAt = new Date(target);
  remindAt.setDate(remindAt.getDate() - recurring.remindBeforeDays);
  remindAt.setHours(WEEKLY_REPORT_HOUR, 0, 0, 0);

  await scheduleAt(remindAt, {
    title: `${recurring.name} 결제가 다가와요`,
    body: `${recurring.remindBeforeDays}일 뒤 ${wonUnit(recurring.amount)}이 빠져나갑니다`,
    route: '/recurring',
  });
}
