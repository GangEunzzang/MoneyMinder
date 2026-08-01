import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { type NotifyKey, useAppState } from '@/entities/app/store';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Card,
  IconAward,
  IconBell,
  IconChart,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

const ITEMS: { key: NotifyKey; label: string; hint: string }[] = [
  { key: 'noSpendRemind', label: '무지출 리마인더', hint: '자정 전 오늘의 무지출 확인' },
  { key: 'missionDone', label: '미션 달성 축하', hint: '스트릭·배지 달성 순간 알림' },
  { key: 'weekly', label: '주간 리포트', hint: '매주 지출 요약 정리' },
];

export default function Permission() {
  const c = useColors();
  const setNotify = useAppState((s) => s.setNotify);

  const allow = () => {
    ITEMS.forEach((item) => setNotify(item.key, true));
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack gap="4xl" center style={styles.head}>
        <View style={[styles.badge, { backgroundColor: c.violetSoft }]}>
          <IconBell size={34} color={c.violet} />
        </View>
        <Stack gap="xl" center>
          <Text variant="title2Flat">알림을 켜주세요</Text>
          <Text variant="bodySoftLead" color="smoke" style={styles.center}>
            {'무지출 리마인더와 미션 소식을\n놓치지 않게 알려드릴게요'}
          </Text>
        </Stack>
      </Stack>

      <Card list>
        {ITEMS.map((item, i) => (
          <Row key={item.key} gap="xl" py="xl" divider={i > 0}>
            <View style={[styles.icon, { backgroundColor: c.surface2 }]}>
              {i === 0 ? (
                <IconBell size={18} color={c.inkSoft} />
              ) : i === 1 ? (
                <IconAward size={18} color={c.inkSoft} />
              ) : (
                <IconChart size={18} color={c.inkSoft} />
              )}
            </View>
            <Stack gap="xxs" style={styles.mid}>
              <Text variant="bodyBold">{item.label}</Text>
              <Text variant="microSoft" color="smoke">
                {item.hint}
              </Text>
            </Stack>
          </Row>
        ))}
      </Card>

      <Text variant="captionMutedLead" color="smoke" style={styles.note}>
        기기 알림 권한은 푸시를 붙일 때 실제로 물어봐요. 지금은 무엇을 받을지만 정해둡니다.
      </Text>

      <Stack gap="lg" style={styles.actions}>
        <Button label="알림 허용하기" onPress={allow} />
        <Button label="나중에 할게요" variant="secondary" onPress={() => router.back()} />
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: space['7xl'],
    paddingBottom: space['5xl'],
  },
  head: { paddingBottom: space['6xl'] },
  badge: {
    width: 84,
    height: 84,
    borderRadius: radius['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  mid: { flex: 1, minWidth: 0 },
  note: { paddingTop: space['3xl'] },
  actions: { paddingTop: space['6xl'] },
});
