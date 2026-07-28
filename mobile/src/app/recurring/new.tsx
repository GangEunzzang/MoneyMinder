import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { EXPENSE_CATEGORIES } from '@/entities/category/model';
import { useRecurring } from '@/entities/recurring/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { won } from '@/shared/lib/format';
import { screenPadding, space } from '@/shared/theme';
import {
  AmountField,
  Button,
  Chip,
  Divider,
  FieldInput,
  FieldRow,
  Row,
  ScreenHeader,
  Spring,
  Stack,
  Text,
  ToggleRow,
} from '@/shared/ui';

const CYCLE_DAYS = [1, 5, 10, 15, 20, 25] as const;

export default function NewRecurring() {
  const add = useRecurring((s) => s.add);
  const methods = usePaymentMethods((s) => s.methods);

  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [cycleDay, setCycleDay] = useState(5);
  const [categoryId, setCategoryId] = useState('subscription');
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(methods[0]?.id ?? null);
  const [autoRecord, setAutoRecord] = useState(true);
  const [remind, setRemind] = useState(true);

  const parsed = Number(amount);
  const canSave = name.trim().length > 0 && Number.isSafeInteger(parsed) && parsed > 0;

  const onSave = () => {
    if (!canSave) return;
    add({
      id: `rec-${Date.now().toString(36)}`,
      name: name.trim(),
      amount: parsed,
      cycleDay,
      categoryId,
      paymentMethodId,
      autoRecord,
      remindBeforeDays: remind ? 3 : 0,
      lastRecordedMonth: null,
    });
    router.back();
  };

  return (
    <>
      <ScreenHeader
        title="고정 지출 추가"
        right={
            <Pressable onPress={onSave} disabled={!canSave}>
              <Text variant="bodyBold" color={canSave ? 'violet' : 'mist'}>
                저장
              </Text>
            </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AmountField eyebrow="매월 얼마씩 나가나요?" value={amount} onChange={setAmount} />

        <FieldRow
          label="이름"
          input={
            <FieldInput
              value={name}
              onChangeText={setName}
              placeholder="예: 넷플릭스"
              accessibilityLabel="이름"
            />
          }
        />

        <FieldRow label="결제 주기" value={`매월 ${cycleDay}일`} divider />
        <Row gap="sm" style={styles.days}>
          {CYCLE_DAYS.map((day) => (
            <Chip
              key={day}
              label={`${day}일`}
              selected={day === cycleDay}
              onPress={() => setCycleDay(day)}
            />
          ))}
        </Row>

        <Stack gap="lg" style={styles.group}>
          <Text variant="caption" color="smoke">
            카테고리
          </Text>
          <Row gap="sm" style={styles.wrap}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                selected={cat.id === categoryId}
                onPress={() => setCategoryId(cat.id)}
              />
            ))}
          </Row>
        </Stack>

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

        <Divider style={styles.split} />
        <ToggleRow
          label="결제일에 자동으로 기록"
          hint={
            canSave
              ? `${name.trim()} ${won(parsed)}원이 매월 ${cycleDay}일 내역에 추가돼요`
              : '결제일이 되면 내역에 알아서 쌓여요'
          }
          on={autoRecord}
          onChange={setAutoRecord}
        />
        <ToggleRow label="결제 3일 전 알림" on={remind} onChange={setRemind} divider />

        <Spring />
        <Button label="저장" onPress={onSave} disabled={!canSave} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingBottom: space['5xl'],
  },
  days: { flexWrap: 'wrap', rowGap: space.sm, paddingTop: space.xl },
  group: { paddingTop: space['5xl'] },
  wrap: { flexWrap: 'wrap', rowGap: space.sm },
  split: { marginTop: space['5xl'] },
  cta: { marginTop: space['4xl'] },
});
