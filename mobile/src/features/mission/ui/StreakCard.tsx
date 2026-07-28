import { StyleSheet, View } from 'react-native';

import { KOREAN_WEEKDAYS } from '@/shared/lib/format';
import { NumText, Row, Stack, Text } from '@/shared/ui';
import { radius, shadow, space, useColors } from '@/shared/theme';

type Props = {
  streak: number;
  longest: number;
  /** 월~일 달성 여부. */
  week: boolean[];
  todayIndex: number;
};

/** 홈·미션 탭이 공유하는 히어로. 유일한 컬러 블록이라 시선이 여기 먼저 닿는다. */
export function StreakCard({ streak, longest, week, todayIndex }: Props) {
  const c = useColors();

  return (
    <Stack gap="2xl" style={[styles.card, { backgroundColor: c.violet }, shadow.raised]}>
      <Row between center>
        <Text variant="caption" style={{ color: c.onColor, opacity: 0.94 }}>
          연속 무지출
        </Text>
        <View style={[styles.pill, { backgroundColor: c.onColorSoft }]}>
          <NumText variant="micro" style={{ color: c.onColor }}>
            최장 {longest}일
          </NumText>
        </View>
      </Row>

      <Row style={styles.count}>
        <NumText variant="display" style={{ color: c.onColor }}>
          {streak}
        </NumText>
        <Text variant="title3" style={{ color: c.onColor, opacity: 0.8 }}>
          일째
        </Text>
      </Row>

      <Row between>
        {KOREAN_WEEKDAYS.map((label, i) => (
          <Stack key={label} gap="sm" center>
            <Text variant="nano" style={{ color: c.onColor, opacity: 0.65 }}>
              {label}
            </Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: week[i] ? c.onColor : c.onColorSoft },
                i === todayIndex && !week[i] ? { borderWidth: 2, borderColor: c.onColor } : null,
              ]}
            >
              {week[i] ? <View style={[styles.check, { backgroundColor: c.violet }]} /> : null}
            </View>
          </Stack>
        ))}
      </Row>
    </Stack>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius['3xl'], padding: space['4xl'] },
  pill: { paddingHorizontal: space.lg, paddingVertical: space.xxs, borderRadius: radius.pill },
  count: { alignItems: 'flex-end', gap: space.xs },
  dot: { width: 23, height: 23, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  check: { width: 9, height: 9, borderRadius: radius.pill },
});
