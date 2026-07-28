import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, useColors } from '@/shared/theme';
import { IconAward, IconFlame, IconTrophy, NumText, Stack } from '@/shared/ui';

/** 단계가 올라갈수록 상징이 바뀐다 — 같은 아이콘 네 개면 어디까지 왔는지 안 읽힌다. */
const GLYPH: { until: number; Icon: ComponentType<{ size?: number; color?: string }> }[] = [
  { until: 14, Icon: IconFlame },
  { until: 30, Icon: IconAward },
  { until: Infinity, Icon: IconTrophy },
];

/**
 * 획득 배지는 컬러, 미획득은 회색.
 * 미획득에 자물쇠를 쓰지 않는 건 "못 받은 것"이 아니라 "다음 목표"로 읽히게 하려는 것.
 */
export function Badge({ days, streak }: { days: number; streak: number }) {
  const c = useColors();
  const earned = streak >= days;
  const { Icon } = GLYPH.find((g) => days <= g.until)!;

  return (
    <Stack gap="md" center>
      <View style={[styles.disc, { backgroundColor: earned ? c.violetSoft : c.surface2 }]}>
        <Icon size={24} color={earned ? c.violet : c.mist} />
      </View>
      <NumText variant="microBold" color={earned ? 'ink' : 'mist'}>
        {days}일
      </NumText>
    </Stack>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: 52,
    height: 52,
    borderRadius: radius['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
