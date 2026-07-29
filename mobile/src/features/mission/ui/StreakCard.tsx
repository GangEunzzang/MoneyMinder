import { Pressable, StyleSheet, View } from 'react-native';

import { KOREAN_WEEKDAYS } from '@/shared/lib/format';
import { radius, space, useColors } from '@/shared/theme';
import { AmountText, HeroCard, IconCheck, IconFlame, NumText, Row, Stack, Text } from '@/shared/ui';

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
    <HeroCard gap="2xl">
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

      <AmountText value={String(streak)} size="display" color="onColor" unit="일째" />

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
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: space.lg, paddingVertical: space.xs, borderRadius: radius.pill },
  count: { alignItems: 'baseline' },
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
