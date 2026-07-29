import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { findMission, type MissionPeriod, PERIOD_LABEL, targetLabel } from '@/entities/mission/model';
import { useMissions } from '@/entities/mission/store';
import { filterMonth, isExpense, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { toDateKey } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Chip,
  IconTarget,
  NumText,
  Row,
  ScreenHeader,
  Segmented,
  Spring,
  Stack,
  Text,
  type SegmentItem,
} from '@/shared/ui';

const PERIODS: SegmentItem<MissionPeriod>[] = (['week', 'month', 'forever'] as const).map(
  (value) => ({ value, label: PERIOD_LABEL[value] }),
);

export default function MissionSetup() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const spec = findMission(id);
  const start = useMissions((s) => s.start);
  const transactions = useLedger((s) => s.transactions);

  const [target, setTarget] = useState(spec?.defaultTarget ?? 0);
  const [period, setPeriod] = useState<MissionPeriod>('week');

  /** 목표를 고르기 전에 "지금 얼마나 쓰는지"를 보여줘야 숫자를 정할 수 있다. */
  const baseline = useMemo(() => {
    if (!spec?.categoryId) return null;
    const month = filterMonth(transactions, monthKey(new Date()));
    const hits = month.filter((t) => isExpense(t) && t.categoryId === spec.categoryId);
    if (hits.length === 0) return null;

    return Math.round((hits.length / 4) * 10) / 10;
  }, [transactions, spec]);

  if (!spec) {
    return (
      <Stack center style={styles.empty}>
        <Text variant="body" color="smoke">
          없는 미션이에요
        </Text>
      </Stack>
    );
  }

  const onStart = () => {
    start({ id: spec.id, target, period, startedOn: toDateKey(new Date()) });
    router.replace('/missions');
  };

  return (
    <>
      <ScreenHeader title={'미션 설정'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="lg" center style={[styles.hero, { backgroundColor: c[spec.tintSoft] }]}>
          <Stack center style={[styles.icon, { backgroundColor: c.surface }]}>
            <IconTarget size={24} color={c[spec.tint]} />
          </Stack>
          <Text variant="title3Flat">{spec.title}</Text>
          <Text variant="callout" color="smoke">
            {spec.summary}
          </Text>
        </Stack>

        <Text variant="caption" color="smoke" style={styles.q}>
          {spec.question}
        </Text>
        <Row gap="xs" center style={styles.targetRow}>
          <NumText variant="title1" color={spec.tint}>
            {spec.unit === 'won' ? target.toLocaleString('ko-KR') : target}
          </NumText>
          <Text variant="headline" color="smoke">
            {spec.unitLabel}
          </Text>
        </Row>
        <Row gap="sm" style={styles.choices}>
          {spec.targetChoices.map((choice) => (
            <Chip
              key={choice}
              label={targetLabel(spec, choice)}
              selected={choice === target}
              onPress={() => setTarget(choice)}
            />
          ))}
        </Row>

        <Text variant="caption" color="smoke" style={styles.q}>
          기간
        </Text>
        <Segmented items={PERIODS} value={period} onChange={setPeriod} />

        {baseline != null ? (
          <Stack style={[styles.note, { backgroundColor: c.surface2 }]}>
            <Text variant="microSoft" color="smoke">
              · 지난 4주 평균은 주 {baseline}
              {spec.unitLabel}이었어요
            </Text>
          </Stack>
        ) : null}

        <Spring />
        <Button label="미션 시작하기" onPress={onStart} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  hero: { padding: space['5xl'], borderRadius: radius['3xl'], marginTop: space['3xl'] },
  icon: { width: 56, height: 56, borderRadius: radius['2xl'] },
  q: { paddingTop: space['5xl'], paddingBottom: space.md },
  targetRow: { alignItems: 'baseline', paddingVertical: space.lg },
  choices: { flexWrap: 'wrap', rowGap: space.sm },
  note: { padding: space['2xl'], borderRadius: radius.xl, marginTop: space['4xl'] },
  cta: { marginTop: space['4xl'] },
  empty: { flex: 1 },
});
