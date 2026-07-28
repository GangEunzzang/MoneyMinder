import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak, isNoSpendDay, noSpendDaysInMonth } from '@/features/mission';
import { monthHeading, shiftMonth, toDateKey } from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  Calendar,
  Card,
  type DayCell,
  monthCells,
  NumText,
  Row,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function MissionCalendar() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);
  const [ym, setYm] = useState(() => monthKey(new Date()));

  const view = useMemo(() => {
    const today = new Date();
    const todayKey = toDateKey(today);
    const first = transactions.reduce<string | null>(
      (min, t) => (min == null || t.date < min ? t.date : min),
      null,
    );

    const cells = monthCells(ym, (key): Omit<DayCell, 'key' | 'day'> => {
      const future = key > todayKey;
      const before = first == null || key < first;
      const quiet = !future && !before && isNoSpendDay(transactions, key);

      return { muted: future || before, filled: quiet, tone: 'violet' };
    });

    return {
      cells,
      noSpend: noSpendDaysInMonth(transactions, ym, today),
      streak: currentStreak(transactions, today),
    };
  }, [transactions, ym]);

  return (
    <>
      <ScreenHeader title="무지출 캘린더" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, shadow.raised, { backgroundColor: c.violet }]}>
          <Row between>
            <Stack gap="sm">
              <Text variant="captionSoft" color="onColorHigh">
                {monthHeading(ym).slice(6)} 무지출
              </Text>
              <NumText variant="title2Flat" color="onColor">
                {view.noSpend}일
              </NumText>
            </Stack>
            <Stack gap="sm" style={styles.right}>
              <Text variant="captionSoft" color="onColorHigh">
                지금 연속
              </Text>
              <NumText variant="title2Flat" color="onColor">
                {view.streak}일
              </NumText>
            </Stack>
          </Row>
        </View>

        <Row between center>
          <Pressable onPress={() => setYm(shiftMonth(ym, -1))} hitSlop={10}>
            <Text variant="callout" color="smoke">
              이전
            </Text>
          </Pressable>
          <Text variant="calloutBold">{monthHeading(ym)}</Text>
          <Pressable onPress={() => setYm(shiftMonth(ym, 1))} hitSlop={10}>
            <Text variant="callout" color="smoke">
              다음
            </Text>
          </Pressable>
        </Row>

        <Card>
          <Calendar
            title={monthHeading(ym)}
            cells={view.cells}
            footer={
              <Row gap="md" center style={styles.legend}>
                <View style={[styles.dot, { backgroundColor: c.violet }]} />
                <Text variant="micro" color="smoke">
                  칠해진 날이 무지출에 성공한 날이에요
                </Text>
              </Row>
            }
          />
        </Card>
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
  right: { alignItems: 'flex-end' },
  legend: { paddingTop: space['3xl'] },
  dot: { width: 8, height: 8, borderRadius: radius.xs },
});
