import { StyleSheet, View } from 'react-native';

import { radius, space, useColors } from '@/shared/theme';
import { Row, Stack, Text } from '@/shared/ui';

import type { TrendPoint } from '../model/monthly';

const HEIGHT = 72;

/**
 * 최근 6개월 지출 막대. 축 눈금도 값 라벨도 없다 —
 * 여기서 읽어야 하는 건 정확한 금액이 아니라 "늘었나 줄었나" 하나뿐이다.
 */
export function TrendChart({ points }: { points: readonly TrendPoint[] }) {
  const c = useColors();
  const peak = Math.max(...points.map((p) => p.expense), 1);

  return (
    <Row gap="md" style={styles.wrap}>
      {points.map((p) => (
        <Stack key={p.ym} gap="md" style={styles.col}>
          <View style={styles.track}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(3, (p.expense / peak) * HEIGHT),
                  backgroundColor: p.current ? c.violet : c.hairStrong,
                },
              ]}
            />
          </View>
          <Text variant={p.current ? 'nano' : 'nanoSoft'} color={p.current ? 'violetDeep' : 'mist'}>
            {Number(p.ym.slice(5))}월
          </Text>
        </Stack>
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end', paddingTop: space['3xl'] },
  col: { flex: 1, alignItems: 'center' },
  track: { height: HEIGHT, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: 26, borderRadius: radius.xs },
});
