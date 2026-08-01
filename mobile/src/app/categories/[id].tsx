import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  CATEGORY_ICONS,
  CATEGORY_TINTS,
  type IconKey,
  SEED_CATEGORIES,
} from '@/entities/category/model';
import { useCategories, useCategoryStore } from '@/entities/category/store';
import { useLedger } from '@/entities/transaction/store';
import { withParticle } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Card,
  CategoryIcon,
  ConfirmDialog,
  FieldInput,
  FieldRow,
  IconCheck,
  IconTrash,
  Row,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

/** 시드 카테고리는 지울 수 없다. 기록·미션·고정지출이 이 id 를 참조한다. */
const SEED_IDS = new Set(SEED_CATEGORIES.map((c) => c.id));

export default function CategoryEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const categories = useCategories();
  const update = useCategoryStore((s) => s.update);
  const remove = useCategoryStore((s) => s.remove);
  const transactions = useLedger((s) => s.transactions);

  const existing = categories.find((cat) => cat.id === id);
  const [label, setLabel] = useState(existing?.label ?? '');
  const [icon, setIcon] = useState<IconKey>(existing?.icon ?? 'utensils');
  const [tintIndex, setTintIndex] = useState(() =>
    Math.max(
      0,
      CATEGORY_TINTS.findIndex((t) => t.tint === existing?.tint),
    ),
  );
  const [removing, setRemoving] = useState(false);

  if (!existing) {
    return (
      <>
        <ScreenHeader title="카테고리" />
        <Stack center style={styles.gone}>
          <Text variant="body" color="smoke">
            삭제된 카테고리예요
          </Text>
        </Stack>
      </>
    );
  }

  const tint = CATEGORY_TINTS[tintIndex];
  const canSave = label.trim().length > 0;
  const used = transactions.filter((t) => t.categoryId === existing.id).length;

  const save = () => {
    if (!canSave) return;
    update(existing.id, { label: label.trim(), icon, ...tint });
    router.back();
  };

  return (
    <>
      <ScreenHeader title="카테고리 편집" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="xl" center style={styles.preview}>
          <CategoryIcon icon={icon} tint={tint.tint} tintSoft={tint.tintSoft} size={64} round="4xl" />
          <Text variant="headline">{label.trim() || '이름 없음'}</Text>
        </Stack>

        <Card list>
          <FieldRow
            label="이름"
            input={
              <FieldInput
                value={label}
                onChangeText={setLabel}
                placeholder="카페·간식"
                accessibilityLabel="카테고리 이름"
              />
            }
          />
        </Card>

        <Text variant="caption" color="smoke" style={styles.label}>
          아이콘
        </Text>
        <Row gap="md" style={styles.wrap}>
          {CATEGORY_ICONS.map((key) => (
            <Pressable key={key} onPress={() => setIcon(key)} accessibilityLabel={key}>
              <CategoryIcon
                icon={key}
                tint={key === icon ? tint.tint : 'mist'}
                tintSoft={key === icon ? tint.tintSoft : 'surface2'}
                size={48}
              />
            </Pressable>
          ))}
        </Row>

        <Text variant="caption" color="smoke" style={styles.label}>
          색상
        </Text>
        <Row gap="lg">
          {CATEGORY_TINTS.map((t, i) => (
            <Pressable key={t.tint} onPress={() => setTintIndex(i)} accessibilityLabel={t.tint}>
              <View style={[styles.swatch, { backgroundColor: c[t.tint] }]}>
                {i === tintIndex ? <IconCheck size={18} color={c.onColor} strokeWidth={2.6} /> : null}
              </View>
            </Pressable>
          ))}
        </Row>

        <Stack gap="lg" style={styles.actions}>
          <Button label="저장하기" muted={!canSave} onPress={save} />
          {SEED_IDS.has(existing.id) ? null : (
            <Button label="카테고리 삭제" variant="danger" onPress={() => setRemoving(true)} />
          )}
        </Stack>
      </ScrollView>

      <ConfirmDialog
        visible={removing}
        icon={<IconTrash size={24} color={c.red} />}
        title={`${withParticle(existing.label, '을', '를')} 지울까요?`}
        message={
          used > 0
            ? `이미 기록한 ${used}건은 그대로 남고,\n분류만 "기타"로 바뀌어요`
            : '이 카테고리로 기록한 내역은 없어요'
        }
        confirmLabel="삭제"
        onCancel={() => setRemoving(false)}
        onConfirm={() => {
          remove(existing.id);
          setRemoving(false);
          router.back();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  preview: { paddingVertical: space['5xl'] },
  label: { paddingTop: space['5xl'], paddingBottom: space.xl },
  wrap: { flexWrap: 'wrap', rowGap: space.md },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { paddingTop: space['6xl'] },
  gone: { flex: 1 },
});
