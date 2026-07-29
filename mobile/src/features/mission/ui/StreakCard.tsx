import { Pressable, StyleSheet, View } from 'react-native';

import { KOREAN_WEEKDAYS } from '@/shared/lib/format';
import { radius, shadow, space, useColors } from '@/shared/theme';
import { IconCheck, IconFlame, NumText, Row, Stack, Text } from '@/shared/ui';

type Props = {
  streak: number;
  longest: number;
  /** 월~일 달성 여부. */
  week: boolean[];
  todayIndex: number;
  /** 오늘 무지출 인증 풀바. onVerify 가 없으면 누를 수 없는 상태 표시줄이 된다. */
  showVerify?: boolean;
  onVerify?: () => void;
};

/** 홈·미션 탭이 공유하는 히어로. 유일한 컬러 블록이라 시선이 여기 먼저 닿는다. */
export function StreakCard({
  streak,
  longest,
  week,
  todayIndex,
  showVerify,
  onVerify,
}: Props) {
  const c = useColors();

  return (
    <Stack gap="2xl" style={[styles.card, shadow.raised, { backgroundColor: c.violetFill }]}>
      <Row between center>
        <Row gap="sm" center>
          <IconFlame size={16} color={c.onColor} strokeWidth={1.9} />
          <Text variant="callout" color="onColorHigh">
            연속 무지출
          </Text>
        </Row>
        <View style={[styles.pill, { backgroundColor: c.onColorSoft }]}>
          <NumText variant="microBold" color="onColor">
            최장 {longest}일
          </NumText>
        </View>
      </Row>

      <Row gap="xxs" style={styles.count}>
        <NumText variant="display" color="onColor">
          {streak}
        </NumText>
        <Text variant="title3Soft" color="onColorHigh">
          일째
        </Text>
      </Row>

      <Row between style={styles.week}>
        {KOREAN_WEEKDAYS.map((label, i) => (
          <Stack key={label} gap="md" center>
            <Text variant="nanoSoft" color="onColorMid">
              {label}
            </Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: week[i] ? c.onColor : c.onColorSoft },
                i === todayIndex && !week[i] ? { borderWidth: 2, borderColor: c.onColor } : null,
              ]}
            >
              {week[i] ? <IconCheck size={14} color={c.violetFill} strokeWidth={2.6} /> : null}
            </View>
          </Stack>
        ))}
      </Row>

      {showVerify ? (
        <Pressable
          accessibilityRole={onVerify ? 'button' : 'text'}
          disabled={!onVerify}
          onPress={onVerify}
          style={({ pressed }) => [
            styles.verify,
            { backgroundColor: c.onColorSoft, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <IconCheck size={15} color={c.onColor} strokeWidth={2.4} />
          <Text variant="calloutBold" color="onColor">
            오늘 무지출 인증하기
          </Text>
        </Pressable>
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius['3xl'], padding: space['4xl'] },
  pill: { paddingHorizontal: space.lg, paddingVertical: space.xs, borderRadius: radius.pill },
  count: { alignItems: 'flex-end' },
  week: { paddingTop: space.xs },
  dot: {
    width: 26,
    height: 26,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingVertical: space.xl,
    borderRadius: radius.lg,
  },
});
