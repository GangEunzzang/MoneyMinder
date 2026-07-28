import { type ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, style }: Props) {
  const c = useColors();
  const tone = {
    primary: { bg: c.violet, fg: 'onColor' as const },
    secondary: { bg: c.surface2, fg: 'ink' as const },
    danger: { bg: c.redSoft, fg: 'red' as const },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: tone.bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon}
      <Text variant="label" color={tone.fg}>
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
});
