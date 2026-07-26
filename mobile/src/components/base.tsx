import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type C = ReturnType<typeof useTheme>;

type ButtonVariant = 'primary' | 'ghost' | 'white' | 'destructive';
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  icon,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const c = useTheme();
  const bg: Record<ButtonVariant, string> = {
    primary: c.violet,
    ghost: c.surface2,
    white: '#fff',
    destructive: c.redSoft,
  };
  const fg: Record<ButtonVariant, string> = {
    primary: '#fff',
    ghost: c.ink,
    white: c.violetDeep,
    destructive: c.red,
  };
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: disabled ? c.surface2 : bg[variant], opacity: pressed && !disabled ? 0.9 : 1 },
      ]}>
      {icon}
      <Text style={[styles.btnText, { color: disabled ? c.mist : fg[variant] }]}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const c = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, { backgroundColor: active ? c.ink : c.surface2 }]}>
      <Text style={[styles.pillText, { color: active ? '#fff' : c.inkSoft }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
  variant = 'base',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'base' | 'violet';
}) {
  const c = useTheme();
  const bg = variant === 'violet' ? c.violet : c.surface;
  const border = variant === 'violet' ? 'transparent' : c.hair;
  return <View style={[styles.card, { backgroundColor: bg, borderColor: border }, style]}>{children}</View>;
}

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  const c = useTheme();
  return <Text style={[styles.eyebrow, { color: color ?? c.smoke }]}>{children}</Text>;
}

export function makeAmountStyle(c: C, size: number, color?: string) {
  return { fontSize: size, fontWeight: '800' as const, letterSpacing: -0.5, color: color ?? c.ink, fontVariant: ['tabular-nums' as const] };
}

const styles = StyleSheet.create({
  btn: {
    height: 47,
    borderRadius: Radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: { fontSize: 14.5, fontWeight: '700', letterSpacing: -0.3 },
  pill: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  pillText: { fontSize: 12, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: Radius.card, padding: 12 },
  eyebrow: { fontSize: 11, fontWeight: '700' },
});
