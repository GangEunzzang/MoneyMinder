import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { type ColorName, radius, useColors } from '../theme';
import { Row, Stack } from './layout';
import { NumText, Text } from './Text';

type Props = {
  /** 좌측 아이콘 슬롯. 색 스와치(결제수단)도 여기로 넣는다. */
  leading?: ReactNode;
  title: string;
  /** "3일 뒤 · 매월 5일 · 신한체크" — 메타는 칩이 아니라 여기 (D22). */
  subtitle?: string;
  value?: string;
  valueColor?: ColorName;
  trailing?: ReactNode;
  divider?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
};

export function ListRow({
  leading,
  title,
  subtitle,
  value,
  valueColor = 'ink',
  trailing,
  divider,
  dimmed,
  onPress,
}: Props) {
  const body = (
    <Row gap="xl" style={styles.pad} divider={divider}>
      {leading}
      <Stack gap="xxs" style={styles.mid}>
        <Text variant="body" color={dimmed ? 'smoke' : 'ink'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="micro" color="mist" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </Stack>
      {value ? (
        <NumText variant="subheadBold" color={dimmed ? 'mist' : valueColor}>
          {value}
        </NumText>
      ) : null}
      {trailing}
    </Row>
  );

  if (!onPress) return body;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
      {body}
    </Pressable>
  );
}

/** 카테고리·고정지출 아이콘 배지. tint 배경 + 라인 아이콘. */
export function IconBadge({
  children,
  tone = 'surface2',
  size = 40,
  dimmed,
}: {
  children: ReactNode;
  tone?: ColorName;
  size?: number;
  dimmed?: boolean;
}) {
  const c = useColors();

  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, backgroundColor: c[tone], opacity: dimmed ? 0.45 : 1 },
      ]}
    >
      {children}
    </View>
  );
}

/** 결제수단 색 스와치 — 카드 모양. 요약 스택바 색과 짝을 이룬다. */
export function ColorSwatch({ color }: { color: ColorName }) {
  const c = useColors();

  return <View style={[styles.swatch, { backgroundColor: c[color] }]} />;
}

const styles = StyleSheet.create({
  pad: { paddingVertical: 13 },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  badge: { borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 34, height: 22, borderRadius: radius.sm },
});
