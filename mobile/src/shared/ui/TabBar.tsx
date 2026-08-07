import { useRouter } from 'expo-router';
import { type ComponentType } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, pressedStyle, radius, space, useColors } from '../theme';
import { IconFlame, IconGrid, IconHome, IconPlus, IconReceipt } from './icons';
import { Text } from './Text';

type IconCmp = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type Props = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

const TABS: { name: string; label: string; Icon: IconCmp }[] = [
  { name: 'index', label: '홈', Icon: IconHome },
  { name: 'history', label: '내역', Icon: IconReceipt },
  { name: 'mission', label: '미션', Icon: IconFlame },
  { name: 'settings', label: '전체', Icon: IconGrid },
];

const barShadow = Platform.select({
  web: { boxShadow: `0 6px 24px ${palette.light.ink}24` },
  default: {
    shadowColor: palette.light.ink,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});

const fabShadow = Platform.select({
  web: { boxShadow: `0 6px 16px ${palette.light.violet}66` },
  default: {
    shadowColor: palette.light.violet,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

/**
 * 기록(＋)이 가운데 떠 있는 5칸 바. 가장 자주 하는 일이 가장 누르기 쉬운 자리에 온다.
 * 바닥에 붙이지 않고 띄운다 — 콘텐츠가 바 아래로 이어져 보여야 화면이 잘린 느낌이 없다.
 */
export function TabBar({ state, navigation }: Props) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  const renderTab = ({ name, label, Icon }: (typeof TABS)[number]) => {
    const active = activeName === name;
    const color = active ? c.violet : c.smoke;

    return (
      <Pressable
        key={name}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        style={(state) => [styles.tab, pressedStyle(state)]}
        onPress={() => navigation.navigate(name)}
      >
        <Icon size={22} color={color} strokeWidth={1.9} />
        <Text variant={active ? 'nano' : 'nanoMuted'} style={{ color }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, space.xl) }]}>
      <View style={[styles.bar, barShadow, { backgroundColor: c.surface, borderColor: c.hair }]}>
        {TABS.slice(0, 2).map(renderTab)}
        <View style={styles.tab}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="기록하기"
            style={[styles.fab, fabShadow, { backgroundColor: c.violetFill }]}
            onPress={() => router.push('/add')}
          >
            <IconPlus size={24} color={c.onColor} strokeWidth={2.3} />
          </Pressable>
        </View>
        {TABS.slice(2).map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: space.sm, paddingHorizontal: space['3xl'] },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: space.lg,
    borderRadius: radius['5xl'],
    borderWidth: StyleSheet.hairlineWidth,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xxs },
  fab: {
    width: 50,
    height: 50,
    borderRadius: radius['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
