import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CATEGORY_ICONS, CATEGORY_TINTS, type IconKey } from '@/entities/category/model';
import { useCategoryStore } from '@/entities/category/store';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { successFeedback } from '@/shared/lib/haptic';
import { toast } from '@/shared/lib/toast';
import {
  Button,
  Card,
  CategoryIcon,
  FieldInput,
  FieldRow,
  IconCheck,
  Row,
  ScreenHeader,
  Stack,
  Text,
  Toggle,
} from '@/shared/ui';

export default function CategoryNew() {
  const c = useColors();
  const add = useCategoryStore((s) => s.add);

  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState<IconKey>('utensils');
  const [tintIndex, setTintIndex] = useState(0);
  const [income, setIncome] = useState(false);

  const tint = CATEGORY_TINTS[tintIndex];
  const canSave = label.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    add({ label: label.trim(), icon, ...tint, income: income || undefined });
    successFeedback();
    router.back();
    toast('카테고리를 추가했어요');
  };

  return (
    <>
      <ScreenHeader title="카테고리 추가" />
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
          <Row between center py="xl" divider>
            <Text variant="callout" color="inkSoft">
              수입 카테고리
            </Text>
            <Toggle on={income} onChange={setIncome} />
          </Row>
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

        <Stack style={styles.actions}>
          <Button label="추가하기" muted={!canSave} onPress={save} />
        </Stack>
      </ScrollView>
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
});
