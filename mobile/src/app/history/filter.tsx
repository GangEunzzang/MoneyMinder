import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { expenseCategories } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import {
  EMPTY,
  type Filter,
  type Range,
  RANGE_LABEL,
  type TypeFilter,
  useFilter,
} from '@/entities/filter/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { screenPadding, space } from '@/shared/theme';
import { Button, Chip, Row, ScreenHeader, Stack, Text } from '@/shared/ui';

const RANGES: Range[] = ['month', 'prevMonth', 'quarter', 'all'];
const TYPES: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'expense', label: '지출' },
  { value: 'income', label: '수입' },
];

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export default function HistoryFilter() {
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const current = useFilter((s) => s.filter);
  const apply = useFilter((s) => s.apply);

  const [draft, setDraft] = useState<Filter>(current);

  const patch = (next: Partial<Filter>) => setDraft({ ...draft, ...next });

  return (
    <>
      <ScreenHeader
        title="필터"
        right={
          <Pressable onPress={() => setDraft(EMPTY)} hitSlop={10}>
            <Text variant="callout" color="smoke">
              초기화
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="xl">
          <Text variant="calloutBold">기간</Text>
          <Row gap="md" style={styles.wrap}>
            {RANGES.map((r) => (
              <Chip
                key={r}
                label={RANGE_LABEL[r]}
                selected={draft.range === r}
                onPress={() => patch({ range: r })}
              />
            ))}
          </Row>
        </Stack>

        <Stack gap="xl">
          <Text variant="calloutBold">유형</Text>
          <Row gap="md" style={styles.wrap}>
            {TYPES.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                selected={draft.type === t.value}
                onPress={() => patch({ type: t.value })}
              />
            ))}
          </Row>
        </Stack>

        <Stack gap="xl">
          <Text variant="calloutBold">카테고리</Text>
          <Row gap="md" style={styles.wrap}>
            {expenseCategories(categories).map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                selected={draft.categoryIds.includes(cat.id)}
                onPress={() => patch({ categoryIds: toggle(draft.categoryIds, cat.id) })}
              />
            ))}
          </Row>
        </Stack>

        <Stack gap="xl">
          <Text variant="calloutBold">결제수단</Text>
          <Row gap="md" style={styles.wrap}>
            {methods.map((m) => (
              <Chip
                key={m.id}
                label={m.name}
                selected={draft.methodIds.includes(m.id)}
                onPress={() => patch({ methodIds: toggle(draft.methodIds, m.id) })}
              />
            ))}
          </Row>
        </Stack>

        <Button
          label="적용하기"
          style={styles.cta}
          onPress={() => {
            apply(draft);
            router.back();
          }}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: space.xl,
    paddingBottom: space['5xl'],
    gap: space['6xl'],
  },
  wrap: { flexWrap: 'wrap', rowGap: space.md },
  cta: { marginTop: space['4xl'] },
});
