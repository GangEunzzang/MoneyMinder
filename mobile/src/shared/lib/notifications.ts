import * as Notifications from 'expo-notifications';

/**
 * 알림은 앱이 직접 예약해 쏜다. 서버 푸시는 아직 없다 ([[DECISIONS#BD12]]).
 * 알림 7종 중 6종은 폰 안에서 판단할 수 있고, 서버가 필요한 건 리포트뿐이다.
 */

/** 알림을 눌렀을 때 갈 곳. data 로 실어 보낸다. */
export type NotificationRoute = '/add' | '/recurring' | '/mission' | '/monthly';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function hasPermission(): Promise<boolean> {
  const { granted } = await Notifications.getPermissionsAsync();

  return granted;
}

/**
 * iOS 는 한 번 거절하면 앱에서 다시 물을 수 없다 ([[DECISIONS#BD14]]).
 * 그래서 앱을 열자마자가 아니라 값을 보여준 뒤에 부른다.
 */
export async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  // 이미 거절한 뒤라면 다시 물어도 시스템이 창을 띄우지 않는다. 설정으로 보내야 한다.
  if (!current.canAskAgain) return false;

  const { granted } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  return granted;
}

export async function canAskPermission(): Promise<boolean> {
  const { granted, canAskAgain } = await Notifications.getPermissionsAsync();

  return !granted && canAskAgain;
}

type Content = {
  title: string;
  body: string;
  route?: NotificationRoute;
};

function toContent({ title, body, route }: Content): Notifications.NotificationContentInput {
  return { title, body, data: route ? { route } : {} };
}

/** 매일 같은 시각. 반복 예약이라 한 건으로 끝난다. */
export async function scheduleDaily(hour: number, content: Content): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: toContent(content),
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 },
  });
}

/** 매주 같은 요일·시각. weekday 는 1(일)~7(토). */
export async function scheduleWeekly(
  weekday: number,
  hour: number,
  content: Content,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: toContent(content),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute: 0,
    },
  });
}

/** 특정 시각 1회. 이미 지난 시각이면 예약하지 않는다 — 즉시 울려버린다. */
export async function scheduleAt(date: Date, content: Content): Promise<void> {
  if (date.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    content: toContent(content),
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

/** 기록하는 순간 판정되는 것들. 예약이 아니라 바로 띄운다. */
export async function notifyNow(content: Content): Promise<void> {
  if (!(await hasPermission())) return;

  await Notifications.scheduleNotificationAsync({ content: toContent(content), trigger: null });
}

/**
 * 예약을 전부 지운다. 재예약은 항상 이걸 먼저 부른다 ([[DECISIONS#BD13]]) —
 * 개별로 관리하면 취소를 빠뜨려 옛 알림이 남는다.
 */
export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function onNotificationTap(handler: (route: NotificationRoute) => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const route = response.notification.request.content.data?.route;

    if (typeof route === 'string') handler(route as NotificationRoute);
  });
}
