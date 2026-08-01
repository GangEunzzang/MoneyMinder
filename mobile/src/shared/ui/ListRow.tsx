import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { type ColorName, radius, space, useColors } from '../theme';
import { IconChevronRight } from './icons';
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
        <NumText variant="bodyBold" color={dimmed ? 'mist' : valueColor}>
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

/**
 * 설정 카드 안의 한 줄. ListRow 보다 조밀하고 좌측 아이콘이 없다 —
 * 설정은 훑어보는 목록이라 아이콘이 붙으면 글자를 읽기 전에 눈이 흩어진다.
 */
export function SettingRow({
  label,
  value,
  trailing,
  divider,
  dimmed,
  danger,
  onPress,
}: {
  label: string;
  value?: string;
  trailing?: ReactNode;
  divider?: boolean;
  dimmed?: boolean;
  /** 되돌릴 수 없는 줄. dimmed 가 "못 누름"이라 위험한 줄은 반드시 다른 표시가 필요하다. */
  danger?: boolean;
  onPress?: () => void;
}) {
  const c = useColors();
  const body = (
    <Row between center style={styles.setting} divider={divider}>
      <Text variant="body" color={danger ? 'red' : dimmed ? 'smoke' : 'ink'}>
        {label}
      </Text>
      <Row gap="sm" center>
        {value ? (
          <Text variant="captionSoft" color="smoke">
            {value}
          </Text>
        ) : null}
        {trailing ?? (onPress ? <IconChevronRight size={16} color={c.mist} /> : null)}
      </Row>
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
  round = 'lg',
  dimmed,
}: {
  children: ReactNode;
  tone?: ColorName;
  size?: number;
  round?: keyof typeof radius;
  dimmed?: boolean;
}) {
  const c = useColors();

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: radius[round],
          backgroundColor: c[tone],
          opacity: dimmed ? 0.45 : 1,
        },
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
  setting: { paddingVertical: space['2xl'] },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  badge: { alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 34, height: 22, borderRadius: radius.sm },
});
