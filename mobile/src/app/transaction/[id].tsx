import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { useLedger } from '@/entities/transaction/store';
import { dateFull, signedWon } from '@/shared/lib/format';
import { radius, screenPadding, shadow, space, useColors } from '@/shared/theme';
import {
  AmountText,
  Button,
  CategoryIcon,
  ConfirmDialog,
  IconPencil,
  IconTrash,
  Row,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const txn = useLedger((s) => s.transactions.find((t) => t.id === id));
  const remove = useLedger((s) => s.remove);
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const [confirming, setConfirming] = useState(false);

  if (!txn) {
    return (
      <>
        <ScreenHeader title="거래 상세" />
        <Stack center style={styles.gone}>
          <Text variant="body" color="smoke">
            삭제된 거래예요
          </Text>
        </Stack>
      </>
    );
  }

  const cat = findCategory(categories, txn.categoryId);
  const method = methods.find((m) => m.id === txn.paymentMethodId);
  const income = txn.type === 'income';
  const heroName = txn.merchant || cat.label;

  const rows: [string, string][] = [
    ['카테고리', cat.label],
    // 히어로가 이미 결제처를 말했으면 같은 값을 한 번 더 쓰지 않는다.
    ...(txn.merchant && txn.merchant !== heroName
      ? [[income ? '보낸 곳' : '결제처', txn.merchant] as [string, string]]
      : []),
    ['날짜', dateFull(txn.date)],
    ...(method ? [['결제수단', method.name] as [string, string]] : []),
    ...(txn.autoRecorded ? [['기록', '고정 지출에서 자동기록'] as [string, string]] : []),
    ...(txn.memo ? [['메모', txn.memo] as [string, string]] : []),
  ];

  const onDelete = () => {
    remove(txn.id);
    setConfirming(false);
    router.back();
  };

  return (
    <>
      <ScreenHeader title="거래 상세" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="lg" center style={styles.hero}>
          <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft="surface2" size={60} round="3xl" />
          <Text variant="subheadSoft" color="smoke">
            {heroName}
          </Text>
          <AmountText
            value={signedWon(income ? txn.amount : -txn.amount)}
            color={income ? 'mintText' : 'ink'}
          />
        </Stack>

        <View style={[styles.card, shadow.card, { backgroundColor: c.surface }]}>
          {rows.map(([key, value], index) => (
            <Row key={key} between py="xl" divider={index > 0}>
              <Text variant="bodySoft" color="smoke">
                {key}
              </Text>
              <Text variant="body" numberOfLines={1} style={styles.value}>
                {value}
              </Text>
            </Row>
          ))}
        </View>

        <Row gap="lg" style={styles.footer}>
          <Button
            label="수정"
            variant="secondary"
            size="sm"
            icon={<IconPencil size={17} color={c.ink} />}
            style={styles.action}
            onPress={() => router.push(`/add?id=${txn.id}`)}
          />
          <Button
            label="삭제"
            variant="danger"
            size="sm"
            icon={<IconTrash size={17} color={c.red} />}
            style={styles.action}
            onPress={() => setConfirming(true)}
          />
        </Row>
      </ScrollView>

      <ConfirmDialog
        visible={confirming}
        icon={<IconTrash size={24} color={c.red} />}
        title="이 거래를 삭제할까요?"
        message="삭제하면 되돌릴 수 없어요"
        confirmLabel="삭제"
        onCancel={() => setConfirming(false)}
        onConfirm={onDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['4xl'] },
  hero: { paddingTop: space['5xl'], paddingBottom: space['4xl'] },
  card: { borderRadius: radius.card, paddingHorizontal: space['3xl'] },
  value: { flexShrink: 1, paddingLeft: space['3xl'] },
  footer: { paddingTop: space['4xl'] },
  action: { flex: 1 },
  gone: { flex: 1 },
});
