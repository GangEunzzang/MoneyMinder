import { Stack as NavStack, router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { daysUntilBilling, isSettledThisMonth, nextBillingDate } from '@/entities/recurring/model';
import { useRecurring } from '@/entities/recurring/store';
import { usePaymentMethod } from '@/entities/payment-method/store';
import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { relativeDay, signedWon, won } from '@/shared/lib/format';
import { screenPadding, space } from '@/shared/theme';
import {
  Button,
  CategoryIcon,
  Divider,
  ListRow,
  NumText,
  Row,
  SectionHeader,
  Spring,
  Stack,
  Text,
  ToggleRow,
} from '@/shared/ui';

export default function RecurringDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useRecurring((s) => s.items.find((r) => r.id === id));
  const update = useRecurring((s) => s.update);
  const remove = useRecurring((s) => s.remove);
  const method = usePaymentMethod(item?.paymentMethodId ?? null);
  const transactions = useLedger((s) => s.transactions);

  const history = useMemo(
    () =>
      item
        ? filterMonth(transactions, monthKey(new Date())).filter(
            (t) => t.autoRecorded && t.merchant === item.name,
          )
        : [],
    [transactions, item],
  );

  if (!item) {
    return (
      <Stack center style={styles.empty}>
        <Text variant="body" color="smoke">
          삭제된 고정 지출이에요
        </Text>
      </Stack>
    );
  }

  const today = new Date();
  const cat = findCategory(item.categoryId);
  const settled = isSettledThisMonth(item, today);

  const onDelete = () =>
    Alert.alert(
      `${item.name}을 삭제할까요?`,
      '이미 기록된 내역은 그대로 남고, 다음 달부터 자동으로 기록되지 않아요',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            remove(item.id);
            router.back();
          },
        },
      ],
    );

  return (
    <>
      <NavStack.Screen options={{ title: item.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Row gap="xl" center style={styles.head}>
          <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} size={44} />
          <Stack gap="xxs">
            <NumText variant="title2">{won(item.amount)}원</NumText>
            <Text variant="micro" color="mist">
              매월 {item.cycleDay}일 · {cat.label}
              {method ? ` · ${method.name}` : ''}
            </Text>
          </Stack>
        </Row>

        <Text variant="micro" color={settled ? 'mist' : 'violetDeep'} style={styles.lede}>
          {settled
            ? `이번 달은 결제됐어요 · 다음은 ${relativeDay(daysUntilBilling(item, today))}`
            : `${relativeDay(daysUntilBilling(item, today))}에 빠져나가요 (${nextBillingDate(item, today).getMonth() + 1}월 ${item.cycleDay}일)`}
        </Text>

        <Divider style={styles.split} />
        <ToggleRow
          label="결제일에 자동으로 기록"
          hint={`${item.name} ${won(item.amount)}원이 매월 ${item.cycleDay}일 내역에 추가돼요`}
          on={item.autoRecord}
          onChange={(on) => update(item.id, { autoRecord: on })}
        />
        <ToggleRow
          label="결제 3일 전 알림"
          on={item.remindBeforeDays > 0}
          onChange={(on) => update(item.id, { remindBeforeDays: on ? 3 : 0 })}
          divider
        />

        <SectionHeader title="자동 기록된 내역" meta={`${history.length}건`} />
        {history.length === 0 ? (
          <Text variant="micro" color="mist" style={styles.none}>
            이번 달에 자동 기록된 내역이 없어요
          </Text>
        ) : (
          history.map((t, i) => (
            <ListRow
              key={t.id}
              leading={<CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />}
              title={t.merchant}
              subtitle={`${t.date.slice(5).replace('-', '월 ')}일 · 자동기록`}
              value={signedWon(-t.amount)}
              divider={i > 0}
            />
          ))
        )}

        <Spring />
        <Button label="고정 지출 삭제" variant="danger" onPress={onDelete} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  head: { paddingTop: space['3xl'] },
  lede: { paddingTop: space['3xl'] },
  split: { marginTop: space['5xl'] },
  none: { paddingVertical: space['4xl'] },
  cta: { marginTop: space['4xl'] },
  empty: { flex: 1 },
});
