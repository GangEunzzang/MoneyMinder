import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { expenseCategories, incomeCategories } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { isCard, type PaymentMethod } from '@/entities/payment-method/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { toDateKey, type TransactionType } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { relativeDay, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Chip,
  FieldInput,
  FieldRow,
  IconCard,
  IconPencil,
  IconPlus,
  IconSettings,
  IconWallet,
  Keypad,
  NumText,
  PayChip,
  Row,
  type SegmentItem,
  Segmented,
  Spring,
  Stack,
  Text,
  Toast,
} from '@/shared/ui';

const TYPES: SegmentItem<TransactionType>[] = [
  { value: 'expense', label: '지출', color: 'red' },
  { value: 'income', label: '수입', color: 'mint' },
];

/** 오늘부터 거슬러 4일. 날짜 선택기를 띄우지 않고 한 번에 고르게 한다. */
const DAY_OFFSETS = [0, -1, -2, -3];

/** 토스트를 읽을 시간. 더 짧으면 글자를 못 읽고, 더 길면 화면이 멈춘 것처럼 보인다. */
const TOAST_MS = 1100;

function dateAt(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);

  return toDateKey(d);
}

export default function AddScreen() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editing = useLedger((s) => (id ? s.transactions.find((t) => t.id === id) : undefined));
  const add = useLedger((s) => s.add);
  const update = useLedger((s) => s.update);
  const methods = usePaymentMethods((s) => s.methods);
  const allCategories = useCategories();

  const [type, setType] = useState<TransactionType>(editing?.type ?? 'expense');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? 'cafe');
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(
    editing ? editing.paymentMethodId : (methods[0]?.id ?? null),
  );
  const [merchant, setMerchant] = useState(editing?.merchant ?? '');
  const [date, setDate] = useState(editing?.date ?? dateAt(0));
  const [memo, setMemo] = useState(editing?.memo ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [detail, setDetail] = useState(false);

  const categories =
    type === 'expense' ? expenseCategories(allCategories) : incomeCategories(allCategories);
  const parsed = Number(amount);
  const canSave = Number.isSafeInteger(parsed) && parsed > 0;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const selectType = (next: TransactionType) => {
    setType(next);
    setCategoryId(next === 'expense' ? 'cafe' : 'salary');
  };

  const onSave = () => {
    if (!canSave) {
      setError('금액을 입력해주세요');

      return;
    }

    const input = {
      type,
      amount: parsed,
      categoryId,
      paymentMethodId: type === 'expense' ? paymentMethodId : null,
      merchant: merchant.trim(),
      memo: memo.trim(),
      date,
      autoRecorded: editing?.autoRecorded ?? false,
    };

    try {
      if (editing) update(editing.id, input);
      else add(input);
    } catch {
      // 저장이 실패하면 화면을 닫지 않는다. 닫아버리면 쓴 내용이 통째로 사라진다.
      setError('저장하지 못했어요. 다시 시도해주세요');

      return;
    }

    setError(null);
    setSaved(
      `${won(parsed)}원 ${type === 'expense' ? '지출' : '수입'}을 ${editing ? '수정' : '기록'}했어요`,
    );
    setTimeout(close, TOAST_MS);
  };

  const detailSummary = [merchant.trim(), memo.trim(), date === dateAt(0) ? null : date.slice(5)]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={[styles.fill, { backgroundColor: c.surface }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.fill}>
        <Row between center style={styles.topbar}>
          <Pressable onPress={close} hitSlop={10} accessibilityLabel="닫기">
            <View style={styles.close}>
              <IconPlus size={24} color={c.inkSoft} />
            </View>
          </Pressable>
          <Segmented items={TYPES} value={type} onChange={selectType} width={150} />
          <View style={styles.spacer} />
        </Row>

        <Stack gap="sm" center style={styles.amountWrap}>
          <Text variant="callout" color={error ? 'red' : 'smoke'}>
            {error ?? (type === 'expense' ? '얼마를 쓰셨나요?' : '얼마를 받으셨나요?')}
          </Text>
          <Row gap="xxs" style={styles.amountRow}>
            <NumText variant="display" color={canSave ? 'ink' : 'mist'}>
              {canSave ? won(parsed) : '0'}
            </NumText>
            <Text variant="title3Soft" color="smoke">
              원
            </Text>
          </Row>
        </Stack>

        <Stack gap="lg" style={styles.section}>
          <Text variant="caption" color="smoke">
            카테고리
          </Text>
          <Row gap="md" style={styles.wrap}>
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
          <Stack gap="lg" style={styles.sectionTop}>
            <Text variant="caption" color="smoke">
              결제수단
            </Text>
            <Row gap="md" style={styles.wrap}>
              {methods.map((m) => (
                <PayChip
                  key={m.id}
                  label={m.name}
                  selected={m.id === paymentMethodId}
                  icon={<MethodIcon method={m} selected={m.id === paymentMethodId} />}
                  onPress={() => setPaymentMethodId(m.id)}
                />
              ))}
              <PayChip
                icon={<IconSettings size={15} color={c.inkSoft} />}
                onPress={() => router.push('/payment-methods')}
              />
            </Row>
          </Stack>
        ) : null}

        <View style={styles.detailWrap}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDetail(true)}
            style={({ pressed }) => [
              styles.detailChip,
              { backgroundColor: c.surface2, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <IconPencil size={15} color={c.smoke} />
            <Text variant="callout" color={detailSummary ? 'ink' : 'smoke'} numberOfLines={1}>
              {detailSummary || '결제처 · 메모 · 날짜 추가'}
            </Text>
          </Pressable>
        </View>

        <Spring />

        <Keypad
          value={amount}
          onChange={(next) => {
            setAmount(next);
            if (error) setError(null);
          }}
        />

        <View style={styles.footer}>
          <Button label={editing ? '수정하기' : '저장하기'} muted={!canSave} onPress={onSave} />
        </View>
      </SafeAreaView>

      {saved ? <Toast message={saved} /> : null}

      <Modal visible={detail} transparent animationType="fade" onRequestClose={() => setDetail(false)}>
        <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={() => setDetail(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={() => {}}>
            <Text variant="headlineStrong">자세히</Text>

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

            <Stack gap="lg" style={styles.sectionTop}>
              <Text variant="caption" color="smoke">
                날짜
              </Text>
              <Row gap="md">
                {DAY_OFFSETS.map((value) => (
                  <Chip
                    key={value}
                    label={relativeDay(value)}
                    selected={dateAt(value) === date}
                    onPress={() => setDate(dateAt(value))}
                  />
                ))}
              </Row>
            </Stack>

            <Button label="확인" style={styles.sheetCta} onPress={() => setDetail(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function MethodIcon({ method, selected }: { method: PaymentMethod; selected: boolean }) {
  const c = useColors();
  const color = selected ? c.onColor : c.inkSoft;

  return isCard(method) ? <IconCard size={15} color={color} /> : <IconWallet size={15} color={color} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topbar: { paddingHorizontal: screenPadding, paddingTop: space.xs },
  close: { transform: [{ rotate: '45deg' }] },
  spacer: { width: 24 },
  amountWrap: { paddingTop: space['6xl'] - 2, paddingBottom: space['5xl'] - 2 },
  amountRow: { alignItems: 'flex-end' },
  section: { paddingHorizontal: screenPadding },
  sectionTop: { paddingHorizontal: screenPadding, paddingTop: space['4xl'] },
  detailWrap: { paddingHorizontal: screenPadding, paddingTop: space['2xl'] },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: 38,
    paddingHorizontal: space.xl,
    borderRadius: radius.lg,
  },
  wrap: { flexWrap: 'wrap', rowGap: space.md },
  footer: { paddingHorizontal: screenPadding, paddingBottom: space['3xl'], paddingTop: space.md },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    paddingHorizontal: space['4xl'],
    paddingTop: space['4xl'],
    paddingBottom: space['6xl'],
    borderTopLeftRadius: radius['4xl'],
    borderTopRightRadius: radius['4xl'],
  },
  sheetCta: { marginTop: space['5xl'] },
});
