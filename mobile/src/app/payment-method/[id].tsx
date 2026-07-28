import { Stack as NavStack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { describe } from '@/entities/payment-method/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { signedWon, won } from '@/shared/lib/format';
import { screenPadding, space } from '@/shared/theme';
import {
  Button,
  CategoryIcon,
  ColorSwatch,
  ListRow,
  NumText,
  Row,
  SectionHeader,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

export default function PaymentMethodDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const method = usePaymentMethods((s) => s.methods.find((m) => m.id === id));
  const remove = usePaymentMethods((s) => s.remove);
  const transactions = useLedger((s) => s.transactions);
  const [confirming, setConfirming] = useState(false);

  const view = useMemo(() => {
    const mine = filterMonth(transactions, monthKey(new Date())).filter(
      (t) => t.paymentMethodId === id && t.type === 'expense',
    );

    return { rows: mine, total: mine.reduce((s, t) => s + t.amount, 0) };
  }, [transactions, id]);

  if (!method) {
    return (
      <Stack center style={styles.empty}>
        <Text variant="body" color="smoke">
          삭제된 결제수단이에요
        </Text>
      </Stack>
    );
  }

  const onDelete = () => {
    if (!confirming) {
      setConfirming(true);
      Alert.alert(
        `${method.name}을 삭제할까요?`,
        `이미 기록한 ${view.rows.length}건의 내역은 그대로 남고, 결제수단만 '없음'으로 바뀌어요`,
        [
          { text: '취소', style: 'cancel', onPress: () => setConfirming(false) },
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => {
              remove(method.id);
              router.back();
            },
          },
        ],
      );
    }
  };

  return (
    <>
      <NavStack.Screen options={{ title: method.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Row gap="xl" center style={styles.head}>
          <ColorSwatch color={method.color} />
          <Stack gap="xxs">
            <Text variant="caption" color="smoke">
              {method.kind === 'card' ? '카드' : method.kind === 'account' ? '계좌' : '현금'}
            </Text>
            <Text variant="micro" color="mist">
              {describe(method)}
            </Text>
          </Stack>
        </Row>

        <NumText variant="title1" style={styles.amount}>
          {won(view.total)}원
        </NumText>
        <Text variant="micro" color="mist">
          이번 달 · 이 수단으로 {view.rows.length}건 결제했어요
        </Text>

        <SectionHeader title="이 수단 내역" />
        {view.rows.length === 0 ? (
          <Text variant="micro" color="mist" style={styles.none}>
            아직 이 수단으로 기록한 내역이 없어요
          </Text>
        ) : (
          view.rows.map((t, i) => {
            const cat = findCategory(t.categoryId);

            return (
              <ListRow
                key={t.id}
                leading={<CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />}
                title={t.merchant || cat.label}
                subtitle={`${t.date.slice(5).replace('-', '월 ')}일 · ${cat.label}`}
                value={signedWon(-t.amount)}
                divider={i > 0}
              />
            );
          })
        )}

        <Spring />
        <Button label="결제수단 삭제" variant="danger" onPress={onDelete} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  head: { paddingTop: space.xl },
  amount: { paddingTop: space.lg },
  none: { paddingVertical: space['4xl'] },
  cta: { marginTop: space['4xl'] },
  empty: { flex: 1 },
});
