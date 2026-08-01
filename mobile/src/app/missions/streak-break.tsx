import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useLedger } from '@/entities/transaction/store';
import { isNoSpendDay } from '@/features/mission';
import { toDateKey } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { Button, IconFlame, Stack, Text } from '@/shared/ui';

export default function StreakBreak() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);

  const yesterday = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);

    return { key: toDateKey(d), quiet: isNoSpendDay(transactions, toDateKey(d)) };
  }, [transactions]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack gap="4xl" center style={styles.head}>
        <View style={[styles.badge, { backgroundColor: c.surface2 }]}>
          <IconFlame size={34} color={c.mist} />
        </View>
        <Stack gap="xl" center>
          <Text variant="title3Flat">무지출 스트릭이 끊겼어요</Text>
          <Text variant="bodySoftLead" color="smoke" style={styles.center}>
            {yesterday.quiet
              ? '오늘 지출이 있었어요\n괜찮아요, 내일부터 다시 시작하면 돼요'
              : '어제 지출이 있었어요\n괜찮아요, 오늘부터 다시 시작하면 돼요'}
          </Text>
        </Stack>
      </Stack>

      <Stack gap="lg" style={styles.actions}>
        <Button
          label="다시 도전하기"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/mission'))}
        />
        <Button
          label="다음에 할게요"
          variant="secondary"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: space['7xl'],
  },
  head: { paddingBottom: space['7xl'] },
  badge: {
    width: 84,
    height: 84,
    borderRadius: radius['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  actions: { paddingTop: space['4xl'] },
});
