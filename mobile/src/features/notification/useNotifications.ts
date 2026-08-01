import { router } from 'expo-router';
import { useEffect } from 'react';

import { useAppState } from '@/entities/app/store';
import { useMissions } from '@/entities/mission/store';
import { useRecurring } from '@/entities/recurring/store';
import { onNotificationTap } from '@/shared/lib/notifications';

import { rescheduleAll } from './schedule';

/**
 * 알림을 앱에 물린다.
 *
 * - 예약에 영향을 주는 값이 바뀌면 전량 재예약한다 ([[DECISIONS#BD13]])
 * - 알림을 누르면 실어 보낸 경로로 이동한다
 */
export function useNotifications(): void {
  const notify = useAppState((s) => s.notify);
  const remind = useMissions((s) => s.remind);
  const remindHour = useMissions((s) => s.remindHour);
  const recurrings = useRecurring((s) => s.items);

  useEffect(() => {
    rescheduleAll().catch(() => undefined);
  }, [notify, remind, remindHour, recurrings]);

  useEffect(() => {
    const subscription = onNotificationTap((route) => router.push(route));

    return () => subscription.remove();
  }, []);
}
