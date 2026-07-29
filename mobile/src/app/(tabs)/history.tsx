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
  txnMeta,
  txnTitle,
  type Transaction,
} from '@/entities/transaction/model';
import { activeCount, applyFilter, isDefault, useFilter } from '@/entities/filter/store';
import { useLedger } from '@/entities/transaction/store';
import { isNoSpendDay, noSpendDaysInMonth } from '@/features/mission';
import { monthPace } from '@/features/report';
import {
  dateFull,
  monthHeading,
  monthLabel,
  shiftMonth,
  signedWon,
  won,
  wonUnit,
} from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  Card,
  CategoryIcon,
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
  const pace = useMemo(() => monthPace(transactions, ym, new Date()), [transactions, ym]);

  const months = useMemo(() => {
    const now = monthKey(new Date());

    return Array.from({ length: PICKER_MONTHS }, (_, i) => shiftMonth(now, -i));
  }, []);

  const renderRow = (t: Transaction, index: number) => {
    const cat = findCategory(categories, t.categoryId);
    const method = t.paymentMethodId ? view.methodName.get(t.paymentMethodId) : null;

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
              {txnTitle(t, cat.label)}
            </Text>
            <Text variant="microSoft" color="smoke" numberOfLines={1}>
              {txnMeta(t, cat.label, method)}
            </Text>
          </Stack>
          <NumText variant="subheadBold" color={t.type === 'income' ? 'mintText' : 'ink'}>
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
          <Row>
            <SummaryCol label="수입" value={`+${won(view.income)}`} tone="mintText" />
            <SummaryCol label="지출" value={`-${won(view.expense)}`} tone="ink" align="center" />
            <SummaryCol
              label="무지출"
              value={`${view.noSpendCount}일`}
              tone="violet"
              align="flex-end"
            />
          </Row>
          {pace.previous > 0 ? (
            <Row center style={styles.pace}>
              <Text variant="captionSoft" color={pace.saved >= 0 ? 'mintText' : 'red'}>
                지난달 같은 기간보다 {wonUnit(pace.saved)} {pace.saved >= 0 ? '덜' : '더'} 쓰는 중
              </Text>
            </Row>
          ) : null}
        </Card>

        {view.entries.length === 0 ? (
          <EmptyState
            inline
            icon={<IconReceipt size={30} color={c.mist} />}
            title={`${monthHeading(ym)} 내역이 없어요`}
            body={'지출이나 수입을 기록하면\n여기에 차곡차곡 쌓여요'}
          />
        ) : (
          /*
           * 한 달치를 카드 한 장에 담는다. 일자마다 카드를 열면 하루 1건인 날이
           * 카드 껍데기만큼 자리를 먹어 목록이 성글어진다. 일자는 리듬, 카드는 그릇.
           */
          <Card list>
            {view.entries.map((entry, index) =>
              entry.kind === 'noSpend' ? (
                <Row
                  key={entry.date}
                  gap="md"
                  center
                  py="lg"
                  style={index > 0 ? [styles.topLine, { borderTopColor: c.hairStrong }] : undefined}
                >
                  <View style={[styles.noSpendDot, { backgroundColor: c.violet }]} />
                  <Text variant="micro" color="violetDeep">
                    {entry.days === 1
                      ? `${shortDate(entry.date)} · 무지출 성공`
                      : `${shortDate(entry.date)}~${shortDate(entry.until)} · 무지출 ${entry.days}일`}
                  </Text>
                </Row>
              ) : (
                <View key={entry.date}>
                  <Row
                    between
                    center
                    style={[
                      styles.dayHead,
                      index > 0 ? [styles.topLine, { borderTopColor: c.hairStrong }] : undefined,
                    ]}
                  >
                    <Text variant="microBold" color="smoke">
                      {dateFull(entry.date)}
                    </Text>
                    {/* 일자 줄에 그날 합계를 얹는다. 라벨만 있으면 빈 줄이 하루마다 생긴다. */}
                    <NumText variant="microBold" color="inkSoft">
                      {sumExpense(entry.rows) > 0 ? `-${won(sumExpense(entry.rows))}` : ''}
                    </NumText>
                  </Row>
                  {entry.rows.map(renderRow)}
                </View>
              ),
            )}
          </Card>
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

/**
 * 라벨은 값의 이름표지 색 코드가 아니다 — 색은 값에만 얹는다.
 * 세 칸을 등폭으로 두어야 숫자가 놓이는 세로 축이 생긴다.
 */
function SummaryCol({
  label,
  value,
  tone,
  align = 'flex-start',
}: {
  label: string;
  value: string;
  tone: 'mintText' | 'ink' | 'violet';
  align?: 'flex-start' | 'center' | 'flex-end';
}) {
  return (
    <Stack gap="xxs" style={[styles.col, { alignItems: align }]}>
      <Text variant="microBold" color="smoke">
        {label}
      </Text>
      <NumText variant="subheadBold" color={tone}>
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
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: space.xxs,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
  },
  summary: { paddingVertical: space['3xl'], paddingHorizontal: space['2xl'] },
  pace: { paddingTop: space['2xl'] },
  col: { flex: 1 },
  noSpendDot: { width: 8, height: 8, borderRadius: radius.xs },
  dayHead: { paddingTop: space['2xl'], paddingBottom: space.xs },
  topLine: { borderTopWidth: StyleSheet.hairlineWidth },
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
