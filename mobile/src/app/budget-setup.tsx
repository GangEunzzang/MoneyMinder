import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/entities/app/store';
import { useLedger } from '@/entities/transaction/store';
import { won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  AmountText,
  Button,
  Chip,
  IconCheck,
  Keypad,
  Row,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

const PRESETS = [500_000, 800_000, 1_000_000, 1_200_000, 1_500_000, 2_000_000];

export default function BudgetSetup() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const setBudget = useLedger((s) => s.setBudget);
  const budget = useLedger((s) => s.budget);
  const onboarded = useAppState((s) => s.onboarded);
  const complete = useAppState((s) => s.complete);
  // 온보딩 중이면 기본값에서 시작하고, 설정에서 들어왔으면 지금 예산을 보여준다.
  const [amount, setAmount] = useState(() => String(onboarded ? budget : 1_200_000));

  const parsed = Number(amount);
  const canSave = Number.isSafeInteger(parsed) && parsed > 0;

  const start = () => {
    if (!canSave) return;
    setBudget(parsed);

    // 온보딩의 마지막 단계일 때만 홈으로 넘긴다. 설정에서 들어왔으면 왔던 자리로 돌아간다.
    if (onboarded) {
      router.back();

      return;
    }
    complete();
    router.replace('/');
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.surface, paddingTop: insets.top }]}>
      <Stack gap="lg" style={styles.head}>
        <Text variant="title3">한 달 예산을 정해볼까요?</Text>
        <Text variant="bodySoft" color="smoke">
          무지출 미션과 지출 관리의 기준이 돼요
        </Text>
      </Stack>

      <Stack gap="sm" center style={styles.amountWrap}>
        <Text variant="callout" color="smoke">
          한 달에 이만큼
        </Text>
        <AmountText
          value={canSave ? won(parsed) : '0'}
          size="display"
          color={canSave ? 'ink' : 'mist'}
        />
      </Stack>

      <Row gap="sm" style={styles.presets}>
        {PRESETS.map((value) => (
          <Chip
            key={value}
            label={`${value / 10_000}만원`}
            selected={value === parsed}
            onPress={() => setAmount(String(value))}
          />
        ))}
      </Row>

      <Row gap="md" center style={[styles.note, { backgroundColor: c.violetSoft }]}>
        <IconCheck size={16} color={c.violetDeep} />
        <Text variant="captionSoft" color="violetDeep" style={styles.noteText}>
          카테고리별 예산은 나중에 설정할 수 있어요
        </Text>
      </Row>

      <Spring />

      {canSave ? (
        <Text variant="micro" color="mist" style={styles.hint}>
          하루 평균 {won(Math.round(parsed / 30))}원까지 쓸 수 있어요
        </Text>
      ) : null}

      <Keypad value={amount} onChange={setAmount} />

      <Stack style={[styles.footer, { paddingBottom: insets.bottom + space['3xl'] }]}>
        <Button label={onboarded ? '저장하기' : '시작하기'} muted={!canSave} onPress={start} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  head: { paddingHorizontal: screenPadding, paddingTop: space['5xl'] },
  amountWrap: { paddingVertical: space['5xl'] },
  amountRow: { alignItems: 'baseline' },
  presets: { flexWrap: 'wrap', rowGap: space.sm, paddingHorizontal: screenPadding },
  note: {
    marginHorizontal: screenPadding,
    marginTop: space['4xl'],
    padding: space['2xl'],
    borderRadius: radius.xl,
  },
  noteText: { flex: 1 },
  footer: { paddingHorizontal: screenPadding },
  hint: { textAlign: 'center' },
});
