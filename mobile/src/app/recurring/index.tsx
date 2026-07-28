import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { findCategory } from '@/entities/category/model';
import {
  daysUntilBilling,
  isSettledThisMonth,
  monthlyTotal,
  type Recurring,
  remainingThisMonth,
  sortByUpcoming,
} from '@/entities/recurring/model';
import { useRecurring } from '@/entities/recurring/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { relativeDay, won, wonUnit } from '@/shared/lib/format';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  CategoryIcon,
  Divider,
  EmptyState,
  IconChevronRight,
  IconRepeat,
  ListRow,
  NumText,
  Row,
  ScreenHeader,
  SectionHeader,
  Spring,
  Stack,
  Text,
  ToggleRow,
} from '@/shared/ui';

export default function RecurringScreen() {
  const c = useColors();
  const items = useRecurring((s) => s.items);
  const update = useRecurring((s) => s.update);
  const methods = usePaymentMethods((s) => s.methods);

  const view = useMemo(() => {
    const today = new Date();
    const sorted = sortByUpcoming(items, today);
    const upcoming = sorted.filter((r) => !isSettledThisMonth(r, today));
    const settled = sorted.filter((r) => isSettledThisMonth(r, today));

    return {
      today,
      upcoming,
      settled,
      total: monthlyTotal(items),
      remaining: remainingThisMonth(items, today),
      next: upcoming[0],
      methodName: new Map(methods.map((m) => [m.id, m.name])),
    };
  }, [items, methods]);

  const allAuto = items.length > 0 && items.every((r) => r.autoRecord);
  const allRemind = items.length > 0 && items.every((r) => r.remindBeforeDays > 0);

  const setAllAuto = (on: boolean) => items.forEach((r) => update(r.id, { autoRecord: on }));
  const setAllRemind = (on: boolean) =>
    items.forEach((r) => update(r.id, { remindBeforeDays: on ? 3 : 0 }));

  const renderRow = (r: Recurring, index: number, settled: boolean) => {
    const cat = findCategory(r.categoryId);
    const method = r.paymentMethodId ? view.methodName.get(r.paymentMethodId) : null;
    const when = settled
      ? `${r.cycleDay}일 결제됨`
      : `${relativeDay(daysUntilBilling(r, view.today))} · 매월 ${r.cycleDay}일`;

    return (
      <ListRow
        key={r.id}
        leading={
          <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} dimmed={settled} />
        }
        title={r.name}
        subtitle={method ? `${when} · ${method}` : when}
        value={wonUnit(r.amount)}
        dimmed={settled}
        divider={index > 0}
        trailing={<IconChevronRight size={16} color={c.mist} />}
        onPress={() => router.push(`/recurring/${r.id}`)}
      />
    );
  };

  return (
    <>
      <ScreenHeader title={'고정 지출'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <EmptyState
            icon={<IconRepeat size={26} color={c.mist} />}
            title="등록한 고정 지출이 없어요"
            body="넷플릭스·통신비처럼 매월 나가는 돈을 등록하면 결제일에 알아서 기록돼요"
            actionLabel="고정 지출 추가"
            onAction={() => router.push('/recurring/new')}
          />
        ) : (
          <>
            <Row between style={styles.summary}>
              <Stack gap="xs">
                <Text variant="caption" color="smoke">
                  매월 고정 지출
                </Text>
                <NumText variant="title2">{won(view.total)}원</NumText>
              </Stack>
              <Stack gap="xs" style={styles.right}>
                <Text variant="micro" color="mist">
                  이번 달 남은
                </Text>
                <NumText variant="subheadFlat" color="violetDeep">
                  {won(view.remaining)}원
                </NumText>
              </Stack>
            </Row>

            {view.next ? (
              <Text variant="captionSoft" color="smoke" style={styles.lede}>
                {view.next.name}가 {relativeDay(daysUntilBilling(view.next, view.today))}에 빠져나가요
              </Text>
            ) : null}

            {view.upcoming.length > 0 ? (
              <>
                <SectionHeader
                  title="곧 결제"
                  meta={`${view.upcoming.length}건 · ${wonUnit(view.remaining)}`}
                  accent
                />
                {view.upcoming.map((r, i) => renderRow(r, i, false))}
              </>
            ) : null}

            {view.settled.length > 0 ? (
              <>
                <SectionHeader
                  title="이번 달 완료"
                  meta={`${view.settled.length}건 · ${wonUnit(view.total - view.remaining)}`}
                />
                {view.settled.map((r, i) => renderRow(r, i, true))}
              </>
            ) : null}

            <Divider style={styles.split} />
            <ToggleRow
              label="결제일에 자동으로 기록"
              hint="기록 안 해도 내역에 쌓여요"
              on={allAuto}
              onChange={setAllAuto}
            />
            <ToggleRow
              label="결제 3일 전 알림"
              hint="잔액 확인하라고 알려드려요"
              on={allRemind}
              onChange={setAllRemind}
              divider
            />

            <Spring />
            <Button
              label="고정 지출 추가"
              variant="secondary"
              size="sm"
              style={styles.cta}
              onPress={() => router.push('/recurring/new')}
            />
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: space.md,
    paddingBottom: space['5xl'],
  },
  summary: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  lede: { paddingTop: space['3xl'] },
  split: { marginTop: space['5xl'] },
  cta: { marginTop: space['4xl'] },
});
