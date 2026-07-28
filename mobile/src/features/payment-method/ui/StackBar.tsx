import { StyleSheet, View } from 'react-native';

import type { ColorName } from '@/shared/theme';
import { radius, space, useColors } from '@/shared/theme';
import { Row, Text } from '@/shared/ui';

type Segment = { id: string; color: ColorName; ratio: number };

/** 결제수단별 비중. 리스트의 색 스와치와 같은 색이라 둘이 한 언어로 읽힌다. */
export function StackBar({ segments, labels }: { segments: Segment[]; labels: Map<string, string> }) {
  const c = useColors();

  if (segments.length === 0) return null;

  return (
    <View>
      <Row gap="xxs" style={styles.bar}>
        {segments.map((s) => (
          <View key={s.id} style={{ flex: s.ratio, height: 10, backgroundColor: c[s.color] }} />
        ))}
      </Row>
      <Row gap="xl" style={styles.legend}>
        {segments.map((s) => (
          <Row key={s.id} gap="xs" center>
            <View style={[styles.dot, { backgroundColor: c[s.color] }]} />
            <Text variant="nano" color="inkSoft">
              {labels.get(s.id) ?? ''}
            </Text>
          </Row>
        ))}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderRadius: radius.xs, overflow: 'hidden', marginTop: space.xl },
  legend: { marginTop: space.lg, flexWrap: 'wrap' },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
});
