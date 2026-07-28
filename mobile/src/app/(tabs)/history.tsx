import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findCategory } from '@/entities/category/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import {
  filterMonth,
  groupByDate,
  monthKey,
  sumExpense,
  sumIncome,
  type Transaction,
} from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { noSpendDaysInMonth } from '@/features/mission';
import { dateHeading, monthHeading, shiftMonth, signedWon, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Divider,
  EmptyState,
  IconChevronRight,
  IconList,
  NumText,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

export default function HistoryScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const methods = usePaymentMethods((s) => s.methods);
  const [ym, setYm] = useState(() => monthKey(new Date()));

  const view = useMemo(() => {
    const inMonth = filterMonth(transactions, ym);
    const groups = [...groupByDate(inMonth).entries()].sort((a, b) => b[0].localeCompare(a[0]));

    return {
      groups,
      income: sumIncome(inMonth),
      expense: sumExpense(inMonth),
      noSpend: noSpendDaysInMonth(transactions, ym, new Date()),
      methodName: new Map(methods.map((m) => [m.id, m.name])),
    };
  }, [transactions, ym, methods]);

  const isThisMonth = ym === monthKey(new Date());

  const renderRow = (t: Transaction, index: number) => {
    const cat = findCategory(t.categoryId);
    const method = t.paymentMethodId ? view.methodName.get(t.paymentMethodId) : null;
    const meta = [cat.label, t.autoRecorded ? '자동기록' : method].filter(Boolean).join(' · ');

    return (
      <Row key={t.id} gap="xl" py="xl" divider={index > 0}>
        <Stack center style={[styles.dot, { backgroundColor: c[cat.tintSoft] }]}>
          <Stack style={[styles.inner, { backgroundColor: c[cat.tint] }]} />
        </Stack>
        <Stack gap="xxs" style={styles.mid}>
          <Text variant="body" numberOfLines={1}>
            {t.merchant || cat.label}
          </Text>
          <Text variant="micro" color="mist" numberOfLines={1}>
            {meta}
          </Text>
        </Stack>
        <NumText variant="bodyBold" color={t.type === 'income' ? 'mint' : 'ink'}>
          {signedWon(t.type === 'expense' ? -t.amount : t.amount)}
        </NumText>
      </Row>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + 96 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Row between center style={styles.header}>
        <Text variant="title3">내역</Text>
        <Row gap="lg" center>
          <Pressable onPress={() => setYm(shiftMonth(ym, -1))} hitSlop={10}>
            <Text variant="micro" color="smoke">
              이전
            </Text>
          </Pressable>
          <Text variant="caption">{monthHeading(ym)}</Text>
          <Pressable
            onPress={() => setYm(shiftMonth(ym, 1))}
            hitSlop={10}
            disabled={isThisMonth}
          >
            <IconChevronRight size={14} color={isThisMonth ? c.hairStrong : c.smoke} />
          </Pressable>
        </Row>
      </Row>

      <Row between style={[styles.summary, { backgroundColor: c.surface }]}>
        <Stack gap="xs">
          <Text variant="nano" color="mint">
            수입
          </Text>
          <NumText variant="callout" color="mint">
            +{won(view.income)}
          </NumText>
        </Stack>
        <Divider style={styles.vline} />
        <Stack gap="xs">
          <Text variant="nano" color="red">
            지출
          </Text>
          <NumText variant="callout">-{won(view.expense)}</NumText>
        </Stack>
        <Divider style={styles.vline} />
        <Stack gap="xs">
          <Text variant="nano" color="smoke">
            무지출
          </Text>
          <NumText variant="callout" color="violetDeep">
            {view.noSpend}일
          </NumText>
        </Stack>
      </Row>

      {view.groups.length === 0 ? (
        <EmptyState
          icon={<IconList size={24} color={c.mist} />}
          title={`${monthHeading(ym)}에 기록이 없어요`}
          body="아래 ＋로 3초 만에 남겨보세요. 하루 한 줄이면 한 달이 보여요."
          actionLabel="기록하기"
          onAction={() => router.push('/add')}
        />
      ) : (
        view.groups.map(([dateKey, rows]) => (
          <Stack key={dateKey} style={styles.group}>
            <Row between center style={styles.groupHead}>
              <Text variant="caption" color="smoke">
                {dateHeading(dateKey)}
              </Text>
              <NumText variant="micro" color="mist">
                {sumExpense(rows) > 0 ? `-${won(sumExpense(rows))}` : '무지출'}
              </NumText>
            </Row>
            {rows.map(renderRow)}
          </Stack>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: screenPadding },
  header: { paddingBottom: space['3xl'] },
  summary: { paddingVertical: space['2xl'], paddingHorizontal: space['4xl'], borderRadius: radius.card },
  vline: { width: StyleSheet.hairlineWidth, height: 28 },
  group: { paddingTop: space['5xl'] },
  groupHead: { paddingBottom: space.md },
  dot: { width: 34, height: 34, borderRadius: radius.pill },
  inner: { width: 10, height: 10, borderRadius: radius.pill },
  mid: { flex: 1, minWidth: 0 },
});
