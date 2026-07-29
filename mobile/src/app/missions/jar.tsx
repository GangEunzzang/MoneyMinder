import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import {
  avgSpendPerSpendingDay,
  isNoSpendDay,
  noSpendDaysInMonth,
  noSpendSavings,
} from '@/features/mission';
import { dateFull, monthLabel, percent, toDateKey, won } from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  AmountText,
  Card,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

const GOAL = 100_000;

export default function SavingsJar() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);

  const view = useMemo(() => {
    const today = new Date();
    const ym = monthKey(today);
    const monthTxns = filterMonth(transactions, ym);
    const days = noSpendDaysInMonth(transactions, ym, today);
    const savings = noSpendSavings(monthTxns, days);
    const rate = avgSpendPerSpendingDay(monthTxns);
    const todayKey = toDateKey(today);

    const first = transactions.reduce<string | null>(
      (min, t) => (min == null || t.date < min ? t.date : min),
      null,
    );

    const [y, m] = ym.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    const entries: string[] = [];
    for (let d = last; d >= 1; d -= 1) {
      const key = `${ym}-${String(d).padStart(2, '0')}`;
      if (key > todayKey) continue;
      if (first == null || key < first) break;
      if (isNoSpendDay(transactions, key)) entries.push(key);
    }

    return { ym, days, savings, rate, entries, todayKey };
  }, [transactions]);

  const amount = view.savings?.amount ?? 0;

  return (
    <>
      <ScreenHeader title="무지출 저금통" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, shadow.raised, { backgroundColor: c.violetFill }]}>
          <Stack gap="lg">
            <Text variant="callout" color="onColorHigh">
              무지출로 아낀 돈
            </Text>
            <AmountText value={won(amount)} size="display" color="onColor" />
            <Text variant="caption" color="onColor">
              {view.savings
                ? `${view.days}일 무지출 × 평균 ${won(view.rate)}원`
                : `무지출 ${view.days}일 · 평균을 낼 기록이 아직 모자라요`}
            </Text>
          </Stack>
        </View>

        <Card>
          <Stack gap="xl">
            <Row between center>
              <Text variant="calloutBold">이번 달 목표 {won(GOAL)}원</Text>
              <Text variant="caption" color="violetDeep">
                {percent(amount, GOAL)}%
              </Text>
            </Row>
            <ProgressBar value={amount / GOAL} height={9} />
            <Text variant="micro" color="smoke">
              {amount >= GOAL
                ? '목표를 넘겼어요. 다음 달도 이 속도로.'
                : `${won(GOAL - amount)}원만 더 아끼면 목표 달성이에요`}
            </Text>
          </Stack>
        </Card>

        <SectionHeader title="적립 내역" meta={`${view.entries.length}일`} />

        {view.entries.length === 0 ? (
          <Card>
            <Text variant="captionMutedLead" color="smoke">
              아직 이번 달 무지출인 날이 없어요.{'\n'}
              하루만 안 써도 여기에 쌓이기 시작해요.
            </Text>
          </Card>
        ) : (
          <Card list>
            {view.entries.map((key, i) => (
              <Row key={key} between center py="xl" divider={i > 0}>
                <Stack gap="xxs">
                  <Text variant="body">
                    {monthLabel(new Date(`${key}T00:00:00`))}{' '}
                    {Number(key.slice(8))}일 무지출
                  </Text>
                  <Text variant="microSoft" color="smoke">
                    {key === view.todayKey ? '오늘' : dateFull(key).split(' ')[2]}
                  </Text>
                </Stack>
                <NumText variant="bodyBold" color="mintText">
                  +{won(view.rate)}
                </NumText>
              </Row>
            ))}
          </Card>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: space.xl,
    paddingBottom: space['5xl'],
    gap: space['3xl'],
  },
  hero: { padding: space['4xl'], borderRadius: radius['3xl'] },
});
