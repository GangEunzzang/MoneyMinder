import { useRouter } from 'expo-router';
import type { ComponentType } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { IconFlame, IconHome, IconList, IconPerson, IconPlus } from './icons';

type IconCmp = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
const fabShadow = Platform.select({
  web: { boxShadow: '0 8px 12px rgba(124, 92, 255, 0.35)' },
  default: {
    shadowColor: '#7c5cff',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
});

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function MMTabBar({ state, navigation }: TabBarProps) {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  const item = (name: string, label: string, Icon: IconCmp) => {
    const active = activeName === name;
    const color = active ? c.violet : c.mist;
    return (
      <Pressable key={name} style={styles.tab} onPress={() => navigation.navigate(name)}>
        <Icon size={20} color={color} strokeWidth={1.9} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: c.background, borderTopColor: c.hair, paddingBottom: Math.max(insets.bottom, 6) },
      ]}>
      {item('index', '홈', IconHome)}
      {item('history', '내역', IconList)}
      <View style={styles.tab}>
        <Pressable style={[styles.fab, { backgroundColor: c.violet }, fabShadow]} onPress={() => router.push('/add')}>
          <IconPlus size={21} color="#fff" strokeWidth={2.3} />
        </Pressable>
      </View>
      {item('mission', '미션', IconFlame)}
      {item('settings', '전체', IconPerson)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 10, fontWeight: '600' },
  fab: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -10 }],
    elevation: 6,
  },
});
