import { Stack as NavStack, router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  cardSpend,
  describe,
  isCard,
  stackSegments,
  type PaymentMethod,
} from '@/entities/payment-method/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { filterMonth, monthKey, sumByPaymentMethod, sumExpense } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { StackBar } from '@/features/payment-method';
import { percent, won, wonUnit } from '@/shared/lib/format';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  ColorSwatch,
  IconChevronRight,
  ListRow,
  NumText,
  SectionHeader,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

export default function PaymentMethodsScreen() {
  const c = useColors();
  const methods = usePaymentMethods((s) => s.methods);
  const transactions = useLedger((s) => s.transactions);

  const view = useMemo(() => {
    const thisMonth = filterMonth(transactions, monthKey(new Date()));
    const spendById = sumByPaymentMethod(thisMonth);

    return {
      spendById,
      cards: methods.filter(isCard),
      others: methods.filter((m) => !isCard(m)),
      cardTotal: cardSpend(methods, spendById),
      totalSpend: sumExpense(thisMonth),
      segments: stackSegments(methods, spendById),
      labels: new Map(methods.map((m) => [m.id, m.name])),
    };
  }, [methods, transactions]);

  const renderRow = (pm: PaymentMethod, index: number) => (
    <ListRow
      key={pm.id}
      leading={<ColorSwatch color={pm.color} />}
      title={pm.name}
      subtitle={describe(pm)}
      value={wonUnit(view.spendById.get(pm.id) ?? 0)}
      trailing={<IconChevronRight size={16} color={c.mist} />}
      divider={index > 0}
      onPress={() => router.push(`/payment-method/${pm.id}`)}
    />
  );

  return (
    <>
      <NavStack.Screen options={{ title: '결제수단' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" color="smoke">
          이번 달 카드 사용액
        </Text>
        <Stack gap="xs" style={styles.amount}>
          <NumText variant="title1">{won(view.cardTotal)}원</NumText>
          <Text variant="micro" color="mist">
            전체 지출 {won(view.totalSpend)}원의 {percent(view.cardTotal, view.totalSpend)}%
          </Text>
        </Stack>

        <StackBar segments={view.segments} labels={view.labels} />

        <SectionHeader
          title="카드"
          meta={`${view.cards.length}장 · ${wonUnit(view.cardTotal)}`}
        />
        {view.cards.map(renderRow)}

        <SectionHeader
          title="현금 · 계좌"
          meta={`${view.others.length}개 · ${wonUnit(
            view.others.reduce((s, m) => s + (view.spendById.get(m.id) ?? 0), 0),
          )}`}
        />
        {view.others.map(renderRow)}

        <Spring />
        <Button
          label="결제수단 추가"
          variant="secondary"
          style={styles.cta}
          onPress={() => router.push('/payment-method/new')}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingTop: space.md, paddingBottom: space['5xl'] },
  amount: { paddingTop: space.xs },
  cta: { marginTop: space['4xl'] },
});
