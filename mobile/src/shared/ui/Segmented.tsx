import { Pressable, StyleSheet, View } from 'react-native';

import { type ColorName, radius, space, useColors } from '../theme';
import { Text } from './Text';

export type SegmentItem<T extends string> = {
  value: T;
  label: string;
  /** 선택됐을 때의 글자색. 지출=red / 수입=mint 처럼 의미가 있을 때만 준다. */
  color?: ColorName;
};

type Props<T extends string> = {
  items: readonly SegmentItem<T>[];
  value: T;
  onChange: (next: T) => void;
  /** 화면 폭을 다 쓰지 않는 자리(상단 바 가운데)에서 폭을 고정한다. */
  width?: number;
};

export function Segmented<T extends string>({ items, value, onChange, width }: Props<T>) {
  const c = useColors();

  return (
    <View style={[styles.track, { backgroundColor: c.surface2 }, width ? { width } : styles.fill]}>
      {items.map((item) => {
        const selected = item.value === value;

        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(item.value)}
            hitSlop={{ top: HIT, bottom: HIT }}
            style={[styles.item, selected && { backgroundColor: c.surface }]}
          >
            <Text variant="callout" color={selected ? (item.color ?? 'ink') : 'smoke'}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** 보이는 높이는 38이지만 손가락에는 44를 준다. 작아 보이자고 오탭을 늘릴 수는 없다. */
const TRACK_HEIGHT = 38;
const HIT = (44 - TRACK_HEIGHT) / 2;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: TRACK_HEIGHT,
    padding: space.xs,
    gap: space.xs,
    borderRadius: radius.lg,
  },
  fill: { alignSelf: 'stretch' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
});
