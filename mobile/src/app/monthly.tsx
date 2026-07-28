import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import {
  avgSpendPerSpendingDay,
  currentStreak,
  noSpendDaysInMonth,
  noSpendSavings,
} from '@/features/mission';
import { biggestJump, headline, monthlyReport, TrendChart } from '@/features/report';
import { monthHeading, shiftMonth, signedPercent, won, wonUnit } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Divider,
  EmptyState,
  IconChart,
  IconChevronRight,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function MonthlyReportScreen() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);
  const categories = useCategories();
  const [ym, setYm] = useState(() => monthKey(new Date()));

  const view = useMemo(() => {
    const today = new Date();
    const report = monthlyReport(transactions, ym);
    const noSpend = noSpendDaysInMonth(transactions, ym, today);
    const prevYm = shiftMonth(ym, -1);

    return {
      report,
      noSpend,
      prevNoSpend: noSpendDaysInMonth(transactions, prevYm, today),
      savings: noSpendSavings(filterMonth(transactions, ym), noSpend),
      avgDaily: avgSpendPerSpendingDay(filterMonth(transactions, ym)),
      streak: currentStreak(transactions, today),
      jump: biggestJump(report.categories),
    };
  }, [transactions, ym]);

  const { report } = view;
  const isThisMonth = ym === monthKey(new Date());
  const saved = report.saved > 0;

  const stat = (label: string, value: string, meta: string) => (
    <Stack gap="xs" style={styles.stat}>
      <Text variant="nano" color="smoke">
        {label}
      </Text>
      <NumText variant="headlineStrong">{value}</NumText>
      <Text variant="nanoSoft" color="mist">
        {meta}
      </Text>
    </Stack>
  );

  return (
    <>
      <ScreenHeader title={`${Number(ym.slice(5))}월 결산`} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Row between center style={styles.monthBar}>
          <Pressable onPress={() => setYm(shiftMonth(ym, -1))} hitSlop={10}>
            <Text variant="micro" color="smoke">
              이전
            </Text>
          </Pressable>
          <Text variant="caption">{monthHeading(ym)}</Text>
          <Pressable onPress={() => setYm(shiftMonth(ym, 1))} hitSlop={10} disabled={isThisMonth}>
            <IconChevronRight size={14} color={isThisMonth ? c.hairStrong : c.smoke} />
          </Pressable>
        </Row>

        {report.expense === 0 ? (
          <EmptyState
            icon={<IconChart size={24} color={c.mist} />}
            title={`${monthHeading(ym)}에 기록이 없어요`}
            body="한 달을 기록하면 어디에 얼마를 썼는지, 지난달보다 나아졌는지 한 장으로 보여드려요."
          />
        ) : (
          <>
            <Row gap="xs" style={styles.amount}>
              <NumText variant="display">{won(report.expense)}</NumText>
              <Text variant="title3Soft" color="smoke">
                원
              </Text>
            </Row>
            <Text variant="calloutBold" color={saved ? 'mint' : 'smoke'}>
              {headline(report)}
            </Text>

            <TrendChart points={report.trend} />

            <Divider style={styles.split} />
            <Row between style={styles.stats}>
              {stat('무지출', `${view.noSpend}일`, `지난달 ${view.prevNoSpend}일`)}
              {stat(
                '아낀 돈',
                view.savings ? wonUnit(view.savings.amount) : '—',
                view.savings ? '무지출로' : '기록 더 필요',
              )}
              {stat('하루 평균', wonUnit(view.avgDaily), '쓴 날 기준')}
            </Row>
            <Divider />

            <SectionHeader title="많이 쓴 카테고리" meta="전월 대비" />
            {report.categories.map((row) => {
              const cat = findCategory(categories, row.categoryId);

              return (
                <Stack key={row.categoryId} gap="md" style={styles.catRow}>
                  <Row between center>
                    <Row gap="md" center>
                      <Text variant="bodyBold">{cat.label}</Text>
                      {row.delta != null ? (
                        <Text variant="microBold" color={row.delta > 0 ? 'red' : 'mint'}>
                          {signedPercent(row.delta)}
                        </Text>
                      ) : (
                        <Text variant="nanoSoft" color="mist">
                          처음
                        </Text>
                      )}
                    </Row>
                    <Row gap="md" center>
                      <NumText variant="bodyBold">{wonUnit(row.amount)}</NumText>
                      <NumText variant="nanoSoft" color="mist">
                        {row.share}%
                      </NumText>
                    </Row>
                  </Row>
                  <ProgressBar value={row.share / 100} height={6} color={cat.tint} />
                </Stack>
              );
            })}

            <Stack gap="sm" style={[styles.note, { backgroundColor: c.surface2 }]}>
              {view.jump ? (
                <Text variant="microSoft" color="smoke">
                  · {findCategory(categories, view.jump.categoryId).label}이 지난달보다{' '}
                  {view.jump.delta}% 늘었어요
                </Text>
              ) : null}
              <Text variant="microSoft" color="smoke">
                · 연속 무지출 {view.streak}일째 · 다음 달 미션으로 이어가 보세요
              </Text>
            </Stack>

            <Row gap="lg" style={styles.cta}>
              <Button
                label="미션 만들기"
                variant="secondary"
                size="sm"
                style={styles.half}
                onPress={() => router.push('/missions')}
              />
              <Button label="결산 공유" size="sm" style={styles.half} onPress={() => router.push('/share')} />
            </Row>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  monthBar: { paddingTop: space.md, paddingBottom: space['4xl'] },
  amount: { alignItems: 'flex-end' },
  split: { marginTop: space['5xl'] },
  stats: { paddingVertical: space['3xl'] },
  stat: { flex: 1 },
  catRow: { paddingVertical: space.lg },
  note: { padding: space['2xl'], borderRadius: radius.xl, marginTop: space['4xl'] },
  cta: { marginTop: space['4xl'] },
  half: { flex: 1 },
});
