import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { KIND_LABEL, type PaymentKind } from '@/entities/payment-method/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import type { ColorName } from '@/shared/theme';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { successFeedback } from '@/shared/lib/haptic';
import { toast } from '@/shared/lib/toast';
import {
  Button,
  FieldInput,
  FieldRow,
  IconCheck,
  Row,
  ScreenHeader,
  Segmented,
  Spring,
  Stack,
  Text,
  type SegmentItem,
} from '@/shared/ui';

const KINDS: SegmentItem<PaymentKind>[] = (['card', 'cash', 'account'] as const).map((value) => ({
  value,
  label: KIND_LABEL[value],
}));

const SWATCHES: ColorName[] = ['violet', 'violetDeep', 'mint', 'peach', 'red', 'mist'];

export default function NewPaymentMethod() {
  const c = useColors();
  const add = usePaymentMethods((s) => s.add);
  const [kind, setKind] = useState<PaymentKind>('card');
  const [name, setName] = useState('');
  const [color, setColor] = useState<ColorName>('violet');

  const canSave = name.trim().length > 0;

  const onSave = () => {
    if (!canSave) return;
    add({ id: `pm-${Date.now().toString(36)}`, name: name.trim(), kind, color, billingDay: null });
    successFeedback();
    router.back();
    toast('결제수단을 추가했어요');
  };

  return (
    <>
      <ScreenHeader
        title="결제수단 추가"
        right={
            <Pressable onPress={onSave} disabled={!canSave}>
              <Text variant="bodyBold" color={canSave ? 'violet' : 'mist'}>
                저장
              </Text>
            </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Segmented items={KINDS} value={kind} onChange={setKind} />

        <Stack style={styles.field}>
          <FieldRow
            label={`${KIND_LABEL[kind]} 이름`}
            input={
              <FieldInput
                value={name}
                onChangeText={setName}
                placeholder={kind === 'card' ? '신한체크' : '카카오뱅크'}
                accessibilityLabel="이름"
              />
            }
          />
        </Stack>

        <Stack gap="lg" style={styles.field}>
          <Text variant="caption" color="smoke">
            색상
          </Text>
          <Row between>
            {SWATCHES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setColor(s)}
                style={[styles.swatch, { backgroundColor: c[s] }]}
              >
                {s === color ? <IconCheck size={16} color={c.onColor} /> : null}
              </Pressable>
            ))}
          </Row>
        </Stack>

        <Text variant="micro" color="mist" style={styles.hint}>
          체크카드 · 현금 · 계좌는 결제일이 없어요
        </Text>

        <Spring />
        <View style={styles.footer}>
          <Button label="저장" onPress={onSave} disabled={!canSave} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingTop: space['3xl'], paddingBottom: space['5xl'] },
  field: { marginTop: space.md },
  swatch: { width: 44, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: space['3xl'] },
  footer: { marginTop: space['4xl'] },
});
