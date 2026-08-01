import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { filterMonth, monthKey, sumExpense } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { noSpendDaysInMonth } from '@/features/mission';
import { monthlyReport, TrendChart } from '@/features/report';
import { monthLabel, percent, shiftMonth, won, wonUnit } from '@/shared/lib/format';
import { screenPadding, space } from '@/shared/theme';
import {
  AmountText,
  Card,
  NumText,
  Row,
  ScreenHeader,
  SectionHeader,
  Segmented,
  type SegmentItem,
  Stack,
  Text,
} from '@/shared/ui';

type Span = 'month' | 'quarter' | 'year';

const SPANS: SegmentItem<Span>[] = [
  { value: 'month', label: '6개월' },
  { value: 'quarter', label: '분기' },
  { value: 'year', label: '연간' },
];

/** 분기·연간은 6개월 추이를 묶어서 본다. 막대 개수가 아니라 묶는 단위가 달라진다. */
const GROUP: Record<Span, number> = { month: 1, quarter: 3, year: 12 };

export default function StatsTrend() {
  const transactions = useLedger((s) => s.transactions);
  const [span, setSpan] = useState<Span>('month');
  const ym = monthKey(new Date());

  const view = useMemo(() => {
    const report = monthlyReport(transactions, ym);
    const size = GROUP[span];
    const points = Array.from({ length: 6 }, (_, i) => {
      const offset = (5 - i) * size;
      const start = shiftMonth(ym, -offset - size + 1);
      let expense = 0;
      for (let m = 0; m < size; m += 1) {
        expense += sumExpense(filterMonth(transactions, shiftMonth(start, m)));
      }

      return { ym: start, expense, current: offset === 0 };
    });
    const total = points.reduce((sum, p) => sum + p.expense, 0);

    return {
      report,
      points,
      average: Math.round(total / points.filter((p) => p.expense > 0).length || 0),
      noSpend: noSpendDaysInMonth(transactions, ym, new Date()),
    };
  }, [transactions, ym, span]);

  const saved = view.report.saved > 0;

  return (
    <>
      <ScreenHeader title="지출 추이" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Segmented items={SPANS} value={span} onChange={setSpan} />

        <Card>
          <Stack gap="lg">
            <Text variant="callout" color="smoke">
              {span === 'month' ? '월별 지출 추이' : span === 'quarter' ? '분기별 지출' : '연간 지출'}
            </Text>
            <AmountText value={won(view.report.expense)} size="title2Soft" />
            <TrendChart points={view.points} />
          </Stack>
        </Card>

        <SectionHeader title="이번 달" />
        <Card>
          <Stack gap="xl">
            <Text variant="bodyBold" color={saved ? 'mintText' : 'red'}>
              {view.report.prevExpense > 0
                ? `지난달보다 ${wonUnit(view.report.saved)} ${saved ? '덜' : '더'} 썼어요`
                : '지난달 기록이 없어 비교할 수 없어요'}
            </Text>
            <Row between>
              <Text variant="captionMuted" color="inkSoft">
                {view.report.prevExpense > 0
                  ? `${Math.abs(percent(view.report.saved, view.report.prevExpense))}% ${saved ? '감소' : '증가'} · 무지출 ${view.noSpend}일의 힘이에요`
                  : `이번 달 무지출 ${view.noSpend}일`}
              </Text>
            </Row>
          </Stack>
        </Card>

        <SectionHeader title="평균" meta={`${monthLabel(new Date())} 기준`} />
        <Card list>
          <Row between center py="xl">
            <Text variant="body">기간 평균</Text>
            <NumText variant="bodyBold">{wonUnit(view.average)}</NumText>
          </Row>
          <Row between center py="xl" divider>
            <Text variant="body">가장 많이 쓴 달</Text>
            <NumText variant="bodyBold">
              {wonUnit(Math.max(...view.points.map((p) => p.expense)))}
            </NumText>
          </Row>
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
});
