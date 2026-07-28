import { StyleSheet } from 'react-native';

import { radius, useColors } from '@/shared/theme';
import { IconFlame, NumText, Stack, Text } from '@/shared/ui';

/**
 * 획득 배지는 컬러, 미획득은 회색 + 남은 일수.
 * 미획득에 자물쇠를 쓰지 않는 건 "못 받은 것"이 아니라 "다음 목표"로 읽히게 하려는 것.
 */
export function Badge({
  days,
  streak,
}: {
  days: number;
  streak: number;
}) {
  const c = useColors();
  const earned = streak >= days;

  return (
    <Stack gap="sm" center style={styles.col}>
      <Stack center style={[styles.disc, { backgroundColor: earned ? c.violetSoft : c.surface2 }]}>
        <IconFlame size={18} color={earned ? c.violet : c.mist} />
      </Stack>
      <NumText variant="nano" color={earned ? 'ink' : 'mist'}>
        {days}일
      </NumText>
      {!earned ? (
        <Text variant="nano" color="mist">
          {days - streak}일 남음
        </Text>
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  col: { flex: 1 },
  disc: { width: 52, height: 52, borderRadius: radius.pill },
});
