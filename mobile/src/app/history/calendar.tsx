import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { filterMonth, groupByDate, monthKey, sumExpense } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { isNoSpendDay, noSpendDaysInMonth } from '@/features/mission';
import { dateFull, monthHeading, shiftMonth, signedWon, toDateKey, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Calendar,
  Card,
  CategoryIcon,
  type DayCell,
  IconChevronRight,
  monthCells,
  NumText,
  Row,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

/** 달력 칸에 -8,500 을 그대로 쓰면 칸을 넘는다. 천/만 단위로 접는다. */
function shortWon(n: number): string {
  if (n >= 10_000) return `-${Math.round(n / 1000) / 10}만`;
  if (n >= 1_000) return `-${Math.round(n / 100) / 10}천`;

  return `-${n}`;
}

export default function HistoryCalendar() {
  const c = useColors();
  const categories = useCategories();
  const transactions = useLedger((s) => s.transactions);
  const [ym, setYm] = useState(() => monthKey(new Date()));
  const [picked, setPicked] = useState<string | null>(null);

  const view = useMemo(() => {
    const inMonth = filterMonth(transactions, ym);
    const byDate = groupByDate(inMonth);
    const todayKey = toDateKey(new Date());

    const cells = monthCells(ym, (key): Omit<DayCell, 'key' | 'day'> => {
      const rows = byDate.get(key) ?? [];
      const spent = sumExpense(rows);
      const future = key > todayKey;
      const quiet = !future && isNoSpendDay(transactions, key);

      return {
        muted: future,
        filled: quiet,
        tone: 'violet',
        note: spent > 0 ? shortWon(spent) : undefined,
      };
    });

    return { cells, noSpend: noSpendDaysInMonth(transactions, ym, new Date()), byDate };
  }, [transactions, ym]);

  const rows = picked ? (view.byDate.get(picked) ?? []) : [];

  return (
    <>
      <ScreenHeader
        title="내역 달력"
        right={
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text variant="calloutBold" color="violet">
              목록
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            onPressDay={(key) => setPicked(key === picked ? null : key)}
            footer={
              <Row gap="md" center style={styles.legend}>
                <View style={[styles.dot, { backgroundColor: c.violet }]} />
                <Text variant="micro" color="smoke">
                  무지출 성공 · 이번 달 무지출 {view.noSpend}일
                </Text>
              </Row>
            }
          />
        </Card>

        {picked ? (
          <Stack gap="xl">
            <Text variant="subhead">{dateFull(picked)}</Text>
            {rows.length === 0 ? (
              <Card>
                <Text variant="captionMutedLead" color="smoke">
                  이 날은 한 푼도 쓰지 않았어요.
                </Text>
              </Card>
            ) : (
              <Card list>
                {rows.map((t, i) => {
                  const cat = findCategory(categories, t.categoryId);

                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => router.push(`/transaction/${t.id}`)}
                      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                    >
                      <Row gap="xl" py="xl" divider={i > 0}>
                        <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />
                        <Stack gap="xxs" style={styles.mid}>
                          <Text variant="body" numberOfLines={1}>
                            {t.merchant || cat.label}
                          </Text>
                          <Text variant="microSoft" color="smoke">
                            {cat.label}
                          </Text>
                        </Stack>
                        <NumText
                          variant="subheadBold"
                          color={t.type === 'income' ? 'mintText' : 'ink'}
                        >
                          {signedWon(t.type === 'expense' ? -t.amount : t.amount)}
                        </NumText>
                        <IconChevronRight size={16} color={c.mist} />
                      </Row>
                    </Pressable>
                  );
                })}
              </Card>
            )}
          </Stack>
        ) : (
          <Card>
            <Text variant="captionMutedLead" color="smoke">
              날짜를 누르면 그날 기록을 볼 수 있어요.{'\n'}
              이번 달 지출 {won(sumExpense(filterMonth(transactions, ym)))}원.
            </Text>
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
  legend: { paddingTop: space['3xl'] },
  dot: { width: 8, height: 8, borderRadius: radius.xs },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
});
