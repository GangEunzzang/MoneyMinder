import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { filterMonth, monthKey, sumExpense } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak, startOfWeek, StreakCard, weekProgress } from '@/features/mission';
import { percent, signedWon, weekdayIndex, won, wonUnit } from '@/shared/lib/format';
import { screenPadding, space } from '@/shared/theme';
import { ListRow, NumText, ProgressBar, Row, SectionHeader, Stack, Text } from '@/shared/ui';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const budget = useLedger((s) => s.budget);

  const view = useMemo(() => {
    const today = new Date();
    const spent = sumExpense(filterMonth(transactions, monthKey(today)));
    const { done } = weekProgress(transactions, startOfWeek(today), today);

    return {
      spent,
      left: budget - spent,
      ratio: budget > 0 ? spent / budget : 0,
      streak: currentStreak(transactions, today),
      week: done,
      todayIndex: weekdayIndex(today),
      recent: transactions.slice(0, 4),
    };
  }, [transactions, budget]);

  const over = view.left < 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + 96 }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack gap="xxs" style={styles.header}>
        <Text variant="title3">은짱님</Text>
        <Text variant="micro" color="smoke">
          오늘도 무지출 도전 중
        </Text>
      </Stack>

      <StreakCard streak={view.streak} longest={21} week={view.week} todayIndex={view.todayIndex} />

      <SectionHeader title="이번 달 지출" />
      <Stack gap="xl">
        <Row between style={styles.amountRow}>
          <NumText variant="title2">{won(view.spent)}</NumText>
          <Text variant="micro" color={over ? 'red' : 'violetDeep'}>
            {over ? `${wonUnit(view.left)} 초과` : `${wonUnit(view.left)} 남음`}
          </Text>
        </Row>
        <ProgressBar value={view.ratio} color={over ? 'red' : 'violet'} height={7} />
        <Text variant="micro" color="mist">
          예산 {won(budget)}원의 {percent(view.spent, budget)}%
        </Text>
      </Stack>

      <SectionHeader title="최근 기록" meta="전체 보기" accent />
      {view.recent.length === 0 ? (
        <Text variant="micro" color="mist" style={styles.empty}>
          아직 기록이 없어요. 아래 ＋로 3초 만에 남겨보세요.
        </Text>
      ) : (
        view.recent.map((t, i) => (
          <ListRow
            key={t.id}
            title={t.merchant || t.categoryId}
            subtitle={t.autoRecorded ? `${t.categoryId} · 자동기록` : t.categoryId}
            value={signedWon(t.type === 'expense' ? -t.amount : t.amount)}
            valueColor={t.type === 'income' ? 'mint' : 'ink'}
            divider={i > 0}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding },
  header: { paddingBottom: space['4xl'] },
  amountRow: { alignItems: 'flex-end' },
  empty: { paddingVertical: space['4xl'] },
});
