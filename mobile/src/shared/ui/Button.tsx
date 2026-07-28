import { type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { type ColorName, radius, space, useColors } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: ReactNode;
  disabled?: boolean;
  /**
   * 아직 저장할 수 없어 보이지만 눌리기는 하는 상태. 비활성으로 막아버리면
   * "왜 안 되는지" 말해줄 기회가 사라진다 (펜슬 Add-Error).
   */
  muted?: boolean;
  /** 화면을 대표하는 저장 버튼은 md, 다이얼로그·푸터에 둘씩 놓이는 버튼은 sm. */
  size?: 'md' | 'sm';
  /** 배경을 직접 지정한 버튼(축하 화면의 흰 버튼)에서 글자색까지 맞추기 위한 탈출구. */
  labelColor?: ColorName;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  muted,
  size = 'md',
  labelColor,
  style,
}: Props) {
  const c = useColors();
  const tone = {
    primary: { bg: c.violet, fg: 'onColor' as const },
    secondary: { bg: c.surface2, fg: 'ink' as const },
    danger: { bg: c.redSoft, fg: 'red' as const },
  }[variant];
  const shown = muted ? { bg: c.surface2, fg: 'mist' as const } : tone;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.small,
        { backgroundColor: shown.bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon}
      <Text variant={size === 'sm' ? 'bodyBold' : 'label'} color={labelColor ?? shown.fg}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    paddingHorizontal: space['5xl'] - 2,
    borderRadius: radius.card,
  },
  small: { height: 48, gap: space.sm },
});
