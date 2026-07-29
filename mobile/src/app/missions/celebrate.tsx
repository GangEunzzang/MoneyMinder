import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMissions } from '@/entities/mission/store';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak, startOfWeek, weekProgress } from '@/features/mission';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { Button, IconPartyPopper, NumText, Row, Spring, Stack, Text } from '@/shared/ui';

export default function MissionCelebrate() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const weeklyGoal = useMissions((s) => s.weeklyGoal);

  const view = useMemo(() => {
    const today = new Date();

    return {
      streak: currentStreak(transactions, today),
      achieved: weekProgress(transactions, startOfWeek(today), today).achieved,
    };
  }, [transactions]);

  const metGoal = view.achieved >= weeklyGoal;

  return (
    <View style={[styles.screen, { backgroundColor: c.violet, paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <Stack center style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: c.onColorSoft }]}>
          <IconPartyPopper size={44} color={c.onColor} />
        </View>

        <Row gap="xs" style={styles.count}>
          <NumText variant="display" color="onColor">
            {view.streak}
          </NumText>
          <Text variant="title2Light" color="onColorHigh">
            일째
          </Text>
        </Row>

        <Text variant="title3Flat" color="onColor" style={styles.title}>
          무지출 미션 성공!
        </Text>
        <Text variant="bodySoftLead" color="onColorHigh" style={styles.desc}>
          {metGoal
            ? `이번 주 목표 ${weeklyGoal}일까지 달성했어요\n지금 속도면 최장 기록도 곧이에요`
            : `이번 주 ${view.achieved}일째 무지출이에요\n${weeklyGoal - view.achieved}일만 더 하면 목표 달성`}
        </Text>
      </Stack>

      <Spring />

      <Stack gap="lg" style={[styles.actions, { paddingBottom: insets.bottom + space['6xl'] }]}>
        <Button
          label="친구에게 자랑하기"
          size="sm"
          labelColor="violet"
          style={[styles.action, { backgroundColor: c.onColor }]}
          onPress={() => router.push('/share')}
        />
        <Button
          label="홈으로 돌아가기"
          size="sm"
          labelColor="onColorHigh"
          style={[styles.action, { backgroundColor: c.onColorSoft }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { paddingTop: space['7xl'], paddingHorizontal: screenPadding },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius['6xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { alignItems: 'baseline', paddingTop: space['6xl'] },
  title: { paddingTop: space.xl, textAlign: 'center' },
  desc: { paddingTop: space.xl, textAlign: 'center', maxWidth: 280 },
  actions: { paddingHorizontal: screenPadding },
  action: { height: 50 },
});
