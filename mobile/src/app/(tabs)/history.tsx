import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import {
  groupByDate,
  monthKey,
  sumExpense,
  sumIncome,
  type Transaction,
} from '@/entities/transaction/model';
import { activeCount, applyFilter, isDefault, useFilter } from '@/entities/filter/store';
import { useLedger } from '@/entities/transaction/store';
import { isNoSpendDay, noSpendDaysInMonth } from '@/features/mission';
import { dateFull, monthHeading, monthLabel, shiftMonth, signedWon, won } from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  Card,
  CategoryIcon,
  Divider,
  EmptyState,
  IconCalendar,
  IconChevronDown,
  IconFilter,
  IconSearch,
  IconReceipt,
  NumText,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

const TAB_CLEARANCE = 96;
/** 월 선택기에 띄울 과거 범위. 이보다 옛날은 기록도 거의 없다. */
const PICKER_MONTHS = 12;

type Entry =
  | { kind: 'day'; date: string; rows: Transaction[] }
  | { kind: 'noSpend'; date: string; until: string; days: number };

export default function HistoryScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const filter = useFilter((s) => s.filter);
  const [ym, setYm] = useState(() => monthKey(new Date()));
  const [picking, setPicking] = useState(false);

  const view = useMemo(() => {
    const scope = applyFilter(transactions, filter, ym, new Date());
    const byDate = groupByDate(scope);
    const dates = [...byDate.keys()];
    // 무지출인 날은 거래가 없어 그룹이 안 생긴다. 판정 결과를 타임라인에 직접 끼워 넣는다.
    // 필터가 걸린 동안은 넣지 않는다 — 걸러낸 목록에 "안 쓴 날"을 섞으면 뭘 보는 중인지 흐려진다.
    const entries: Entry[] = [
      ...dates.map((date) => ({ kind: 'day' as const, date, rows: byDate.get(date)! })),
      ...(isDefault(filter) ? noSpendRuns(transactions, ym, new Date()) : []),
    ].sort((a, b) => b.date.localeCompare(a.date));

    return {
      entries,
      income: sumIncome(scope),
      expense: sumExpense(scope),
      noSpendCount: noSpendDaysInMonth(transactions, ym, new Date()),
      methodName: new Map(methods.map((m) => [m.id, m.name])),
    };
  }, [transactions, ym, methods, filter]);

  const filters = activeCount(filter);

  const months = useMemo(() => {
    const now = monthKey(new Date());

    return Array.from({ length: PICKER_MONTHS }, (_, i) => shiftMonth(now, -i));
  }, []);

  const renderRow = (t: Transaction, index: number) => {
    const cat = findCategory(categories, t.categoryId);
    const method = t.paymentMethodId ? view.methodName.get(t.paymentMethodId) : null;
    const meta = [cat.label, method, t.autoRecorded ? '자동기록' : null].filter(Boolean).join(' · ');

    return (
      <Pressable
        key={t.id}
        onPress={() => router.push(`/transaction/${t.id}`)}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      >
        <Row gap="xl" py="xl" divider={index > 0}>
          <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />
          <Stack gap="xxs" style={styles.mid}>
            <Text variant="body" numberOfLines={1}>
              {t.merchant || cat.label}
            </Text>
            <Text variant="microSoft" color="smoke" numberOfLines={1}>
              {meta}
            </Text>
          </Stack>
          <NumText variant="subheadBold" color={t.type === 'income' ? 'mint' : 'ink'}>
            {signedWon(t.type === 'expense' ? -t.amount : t.amount)}
          </NumText>
        </Row>
      </Pressable>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + TAB_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Row between center>
          <Text variant="title3">내역</Text>
          <Row gap="md" center>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="검색"
              onPress={() => router.push('/history/search')}
              style={[styles.iconPill, shadow.pill, { backgroundColor: c.surface }]}
            >
              <IconSearch size={17} color={c.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="필터"
              onPress={() => router.push('/history/filter')}
              style={[
                styles.iconPill,
                shadow.pill,
                { backgroundColor: filters > 0 ? c.violet : c.surface },
              ]}
            >
              <IconFilter size={17} color={filters > 0 ? c.onColor : c.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="달력으로 보기"
              onPress={() => router.push('/history/calendar')}
              style={[styles.iconPill, shadow.pill, { backgroundColor: c.surface }]}
            >
              <IconCalendar size={17} color={c.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="월 선택"
              onPress={() => setPicking(true)}
              style={[styles.monthPill, shadow.pill, { backgroundColor: c.surface }]}
            >
              <Text variant="calloutBold">{monthLabel(new Date(`${ym}-01T00:00:00`))}</Text>
              <IconChevronDown size={15} color={c.ink} />
            </Pressable>
          </Row>
        </Row>

        <Card style={styles.summary}>
          <Row between center>
            <SummaryCol label="수입" value={`+${won(view.income)}`} tone="mint" labelTone="mint" />
            <Divider style={styles.vline} />
            <SummaryCol label="지출" value={`-${won(view.expense)}`} tone="ink" labelTone="red" />
            <Divider style={styles.vline} />
            <SummaryCol
              label="무지출"
              value={`${view.noSpendCount}일`}
              tone="violet"
              labelTone="violet"
            />
          </Row>
        </Card>

        {view.entries.length === 0 ? (
          <EmptyState
            inline
            icon={<IconReceipt size={30} color={c.mist} />}
            title={`${monthHeading(ym)} 내역이 없어요`}
            body={'지출이나 수입을 기록하면\n여기에 차곡차곡 쌓여요'}
          />
        ) : (
          view.entries.map((entry) =>
            entry.kind === 'noSpend' ? (
              <Row
                key={entry.date}
                gap="md"
                center
                style={[styles.noSpend, { backgroundColor: c.violetSoft }]}
              >
                <View style={[styles.noSpendDot, { backgroundColor: c.violet }]} />
                <Text variant="caption" color="violetDeep">
                  {entry.days === 1
                    ? `${shortDate(entry.date)} · 무지출 성공`
                    : `${shortDate(entry.date)}~${shortDate(entry.until)} · 무지출 ${entry.days}일`}
                </Text>
              </Row>
            ) : (
              <Stack key={entry.date} gap="md">
                <Text variant="microBold" color="smoke">
                  {dateFull(entry.date)}
                </Text>
                <Card list>{entry.rows.map(renderRow)}</Card>
              </Stack>
            ),
          )
        )}
      </ScrollView>

      <Modal visible={picking} transparent animationType="fade" onRequestClose={() => setPicking(false)}>
        <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={() => setPicking(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={() => {}}>
            {months.map((m, i) => (
              <Pressable
                key={m}
                onPress={() => {
                  setYm(m);
                  setPicking(false);
                }}
                style={({ pressed }) => (pressed ? styles.pressed : undefined)}
              >
                <Row between center py="xl" divider={i > 0}>
                  <Text variant={m === ym ? 'bodyBold' : 'body'} color={m === ym ? 'violet' : 'ink'}>
                    {monthHeading(m)}
                  </Text>
                </Row>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function SummaryCol({
  label,
  value,
  tone,
  labelTone,
}: {
  label: string;
  value: string;
  tone: 'mint' | 'ink' | 'violet';
  labelTone: 'mint' | 'red' | 'violet';
}) {
  return (
    <Stack gap="xs">
      <Text variant="microBold" color={labelTone}>
        {label}
      </Text>
      <NumText variant="bodyStrong" color={tone}>
        {value}
      </NumText>
    </Stack>
  );
}

/**
 * 그 달의 무지출 구간. 하루씩 배너를 깔면 기록이 적은 달은 화면이 배너로 뒤덮여
 * 정작 쓴 날이 안 보인다 — 이어지는 날은 한 줄로 묶는다.
 * 첫 기록 이전과 미래는 세지 않는다.
 */
function noSpendRuns(
  transactions: readonly Transaction[],
  ym: string,
  today: Date,
): Extract<Entry, { kind: 'noSpend' }>[] {
  const first = transactions.reduce<string | null>(
    (min, t) => (min == null || t.date < min ? t.date : min),
    null,
  );
  if (first == null) return [];

  const [y, m] = ym.split('-').map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const runs: Extract<Entry, { kind: 'noSpend' }>[] = [];
  let open: { from: string; to: string; days: number } | null = null;

  const flush = () => {
    if (open) runs.push({ kind: 'noSpend', date: open.from, until: open.to, days: open.days });
    open = null;
  };

  for (let d = 1; d <= lastDay; d += 1) {
    const key = `${ym}-${String(d).padStart(2, '0')}`;
    if (key > todayKey) break;
    if (key < first || !isNoSpendDay(transactions, key)) {
      flush();
      continue;
    }
    open = open ? { from: open.from, to: key, days: open.days + 1 } : { from: key, to: key, days: 1 };
  }
  flush();

  return runs;
}

/** "7월 26일" — 배너는 요일까지 필요 없다. */
function shortDate(dateKey: string): string {
  const [, m, d] = dateKey.split('-').map(Number);

  return `${m}월 ${d}일`;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: screenPadding, gap: space['3xl'] },
  iconPill: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
  },
  summary: { paddingVertical: space['3xl'], paddingHorizontal: space['2xl'] },
  vline: { width: StyleSheet.hairlineWidth, height: 34 },
  noSpend: { paddingVertical: space.xl, paddingHorizontal: space['2xl'], borderRadius: radius.card },
  noSpendDot: { width: 8, height: 8, borderRadius: radius.xs },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    paddingHorizontal: space['4xl'],
    paddingBottom: space['6xl'],
    borderTopLeftRadius: radius['4xl'],
    borderTopRightRadius: radius['4xl'],
  },
});
