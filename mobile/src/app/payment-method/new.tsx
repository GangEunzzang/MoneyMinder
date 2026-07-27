import { Stack as NavStack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { KIND_LABEL, type PaymentKind } from '@/entities/payment-method/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import type { ColorName } from '@/shared/theme';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { Button, IconCheck, Row, Spring, Stack, Text } from '@/shared/ui';

const KINDS: PaymentKind[] = ['card', 'cash', 'account'];
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
    router.back();
  };

  return (
    <>
      <NavStack.Screen
        options={{
          title: '결제수단 추가',
          headerRight: () => (
            <Pressable onPress={onSave} disabled={!canSave}>
              <Text variant="bodyBold" color={canSave ? 'violet' : 'mist'}>
                저장
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Row gap="xs" style={[styles.seg, { backgroundColor: c.surface2 }]}>
          {KINDS.map((k) => (
            <Pressable
              key={k}
              onPress={() => setKind(k)}
              style={[styles.segItem, k === kind && { backgroundColor: c.surface }]}
            >
              <Text variant="body" color={k === kind ? 'ink' : 'smoke'}>
                {KIND_LABEL[k]}
              </Text>
            </Pressable>
          ))}
        </Row>

        <Stack gap="md" style={styles.field}>
          <Text variant="caption" color="smoke">
            {KIND_LABEL[kind]} 이름
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={kind === 'card' ? '예: 신한체크' : '예: 카카오뱅크'}
            placeholderTextColor={c.mist}
            style={[styles.input, { backgroundColor: c.surface, borderColor: name ? c.violet : c.hairStrong, color: c.ink }]}
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
  seg: { height: 44, borderRadius: radius.lg, padding: space.xs },
  segItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  field: { marginTop: space['4xl'] },
  input: { height: 48, borderRadius: radius.card, borderWidth: 1.5, paddingHorizontal: space['2xl'], fontSize: 14, fontWeight: '600' },
  swatch: { width: 44, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: space['3xl'] },
  footer: { marginTop: space['4xl'] },
});
