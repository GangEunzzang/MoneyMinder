import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Text } from './Text';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? c.violetFill : c.surface2 }]}
    >
      <Text variant="callout" style={{ color: selected ? c.onColor : c.inkSoft }}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * 아이콘을 단 칩. 결제수단은 이름만으로는 카드인지 계좌인지 안 보여서
 * 글자보다 아이콘이 먼저 구분해준다 (펜슬 PayChip).
 */
export function PayChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label?: string;
  icon: ReactNode;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.payChip,
        label ? null : styles.payChipIconOnly,
        { backgroundColor: selected ? c.violetFill : c.surface2 },
      ]}
    >
      {icon}
      {label ? (
        <Text variant="calloutBold" style={{ color: selected ? c.onColor : c.inkSoft }}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

/** 기록·필터의 칩 줄. 넘치면 가로 스크롤 — 줄바꿈은 밀도를 깨뜨린다. */
export function ChipRow<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <Chip key={item} label={item} selected={item === value} onPress={() => onChange(item)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 30,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { gap: space.sm },
  payChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: 34,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
  },
  payChipIconOnly: { paddingHorizontal: space.lg },
});
