import { StyleSheet, View } from 'react-native';

import { KOREAN_WEEKDAYS } from '@/shared/lib/format';
import { radius, space, useColors } from '@/shared/theme';
import { IconCheck, Row, Stack, Text } from '@/shared/ui';

const SIZE = 28;
const CHECK = 15;

/**
 * 이번 주 요일별 달성 도트. 보라 히어로 위(`onColor`)와 흰 카드 위 둘 다 쓴다 —
 * 명암만 뒤집고 크기·간격·체크는 같아야 한다. 두 벌로 두면 반드시 갈린다.
 */
export function WeekDots({
  week,
  todayIndex,
  onColor,
}: {
  week: boolean[];
  todayIndex: number;
  /** 컬러 배경 위에 얹는지. 흰 카드 위면 생략한다. */
  onColor?: boolean;
}) {
  const c = useColors();
  const done = onColor ? c.onColor : c.violet;
  const rest = onColor ? c.onColorSoft : c.surface2;
  const check = onColor ? c.violetFill : c.onColor;

  return (
    <Row between>
      {KOREAN_WEEKDAYS.map((label, i) => (
        <Stack key={label} gap="sm" center>
          <Text variant="nanoSoft" color={onColor ? 'onColorMid' : 'smoke'}>
            {label}
          </Text>
          <View
            style={[
              styles.dot,
              { backgroundColor: week[i] ? done : rest },
              i === todayIndex && !week[i] ? { borderWidth: 2, borderColor: done } : null,
            ]}
          >
            {week[i] ? <IconCheck size={CHECK} color={check} strokeWidth={2.6} /> : null}
          </View>
        </Stack>
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.xxs,
  },
});
