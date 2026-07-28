import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATEGORIES, EXPENSE_CATEGORIES } from '@/entities/category/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { toDateKey, type TransactionType } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { relativeDay } from '@/shared/lib/format';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  AmountField,
  Button,
  Chip,
  FieldInput,
  FieldRow,
  IconPlus,
  Row,
  type SegmentItem,
  Segmented,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

const TYPES: SegmentItem<TransactionType>[] = [
  { value: 'expense', label: '지출', color: 'red' },
  { value: 'income', label: '수입', color: 'mint' },
];

const INCOME_CATEGORIES = CATEGORIES.filter((cat) => cat.id === 'salary' || cat.id === 'etc');

/** 오늘부터 거슬러 4일. 날짜 선택기를 띄우지 않고 한 번에 고르게 한다. */
const DAY_OFFSETS = [0, -1, -2, -3];

export default function AddScreen() {
  const c = useColors();
  const add = useLedger((s) => s.add);
  const methods = usePaymentMethods((s) => s.methods);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('cafe');
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(methods[0]?.id ?? null);
  const [merchant, setMerchant] = useState('');
  const [offset, setOffset] = useState(0);
  const [memo, setMemo] = useState('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const parsed = Number(amount);
  const canSave = Number.isSafeInteger(parsed) && parsed > 0;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const selectType = (next: TransactionType) => {
    setType(next);
    setCategoryId(next === 'expense' ? 'cafe' : 'salary');
  };

  const onSave = () => {
    if (!canSave) return;
    const date = new Date();
    date.setDate(date.getDate() + offset);

    add({
      type,
      amount: parsed,
      categoryId,
      paymentMethodId: type === 'expense' ? paymentMethodId : null,
      merchant: merchant.trim(),
      memo: memo.trim(),
      date: toDateKey(date),
      autoRecorded: false,
    });
    close();
  };

  return (
    <View style={[styles.fill, { backgroundColor: c.surface }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.fill}>
        <Row between center style={styles.topbar}>
          <Pressable onPress={close} hitSlop={10} accessibilityLabel="닫기">
            <View style={styles.close}>
              <IconPlus size={18} color={c.inkSoft} />
            </View>
          </Pressable>
          <Segmented items={TYPES} value={type} onChange={selectType} width={140} />
          <View style={styles.spacer} />
        </Row>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <AmountField
            eyebrow={type === 'expense' ? '얼마를 쓰셨나요?' : '얼마를 받으셨나요?'}
            value={amount}
            onChange={setAmount}
            sign={type === 'expense' ? '-' : '+'}
            color={type === 'income' ? 'mint' : 'ink'}
          />

          <Stack gap="lg">
            <Text variant="caption" color="smoke">
              카테고리
            </Text>
            <Row gap="sm" style={styles.wrap}>
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  selected={cat.id === categoryId}
                  onPress={() => setCategoryId(cat.id)}
                />
              ))}
            </Row>
          </Stack>

          {type === 'expense' ? (
            <Stack gap="lg" style={styles.group}>
              <Text variant="caption" color="smoke">
                결제수단
              </Text>
              <Row gap="sm" style={styles.wrap}>
                {methods.map((m) => (
                  <Chip
                    key={m.id}
                    label={m.name}
                    selected={m.id === paymentMethodId}
                    onPress={() => setPaymentMethodId(m.id)}
                  />
                ))}
              </Row>
            </Stack>
          ) : null}

          <Stack gap="lg" style={styles.group}>
            <Text variant="caption" color="smoke">
              날짜
            </Text>
            <Row gap="sm">
              {DAY_OFFSETS.map((value) => (
                <Chip
                  key={value}
                  label={relativeDay(value)}
                  selected={value === offset}
                  onPress={() => setOffset(value)}
                />
              ))}
            </Row>
          </Stack>

          <Stack style={styles.group}>
            <FieldRow
              label={type === 'expense' ? '결제처' : '보낸 곳'}
              input={
                <FieldInput
                  value={merchant}
                  onChangeText={setMerchant}
                  placeholder={type === 'expense' ? '스타벅스' : '급여'}
                  accessibilityLabel="결제처"
                />
              }
            />
            <FieldRow
              label="메모"
              divider
              input={
                <FieldInput
                  value={memo}
                  onChangeText={setMemo}
                  placeholder="입력"
                  accessibilityLabel="메모"
                />
              }
            />
          </Stack>

          <Spring />
        </ScrollView>

        <View style={styles.footer}>
          <Button label="저장하기" onPress={onSave} disabled={!canSave} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topbar: { paddingHorizontal: screenPadding, paddingVertical: space.md },
  close: { transform: [{ rotate: '45deg' }] },
  spacer: { width: 18 },
  scroll: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['4xl'] },
  wrap: { flexWrap: 'wrap', rowGap: space.sm },
  group: { paddingTop: space['5xl'] },
  footer: { paddingHorizontal: screenPadding, paddingBottom: space['2xl'], paddingTop: space.md },
});
