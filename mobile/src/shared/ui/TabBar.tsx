import { useRouter } from 'expo-router';
import { type ComponentType } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, radius, space, useColors } from '../theme';
import { IconFlame, IconHome, IconList, IconPerson, IconPlus } from './icons';
import { Stack } from './layout';
import { Text } from './Text';

type IconCmp = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type Props = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

const TABS: { name: string; label: string; Icon: IconCmp }[] = [
  { name: 'index', label: '홈', Icon: IconHome },
  { name: 'history', label: '내역', Icon: IconList },
  { name: 'mission', label: '미션', Icon: IconFlame },
  { name: 'settings', label: '전체', Icon: IconPerson },
];

const fabShadow = Platform.select({
  web: { boxShadow: `0 8px 12px ${palette.light.violet}59` },
  default: {
    shadowColor: palette.light.violet,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});

/** 기록(＋)이 가운데 떠 있는 5칸 바. 가장 자주 하는 일이 가장 누르기 쉬운 자리에 온다. */
export function TabBar({ state, navigation }: Props) {
  const c = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  const renderTab = ({ name, label, Icon }: (typeof TABS)[number]) => {
    const active = activeName === name;
    const color = active ? c.violet : c.mist;

    return (
      <Pressable
        key={name}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        style={styles.tab}
        onPress={() => navigation.navigate(name)}
      >
        <Icon size={20} color={color} strokeWidth={1.9} />
        <Text variant="nano" style={{ color }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: c.bg,
          borderTopColor: c.hair,
          paddingBottom: Math.max(insets.bottom, space.sm),
        },
      ]}
    >
      {TABS.slice(0, 2).map(renderTab)}
      <Stack center style={styles.tab}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록하기"
          style={[styles.fab, { backgroundColor: c.violet }, fabShadow]}
          onPress={() => router.push('/add')}
        >
          <IconPlus size={21} color={c.onColor} strokeWidth={2.3} />
        </Pressable>
      </Stack>
      {TABS.slice(2).map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: space.sm,
    paddingHorizontal: space.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: space.xxs },
  fab: {
    width: 46,
    height: 46,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -10 }],
  },
});
