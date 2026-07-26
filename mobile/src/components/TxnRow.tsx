import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function TxnRow({
  name,
  meta,
  amount,
  type = 'expense',
  icon,
}: {
  name: string;
  meta: string;
  amount: string;
  type?: 'expense' | 'income';
  icon?: ReactNode;
}) {
  const c = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.ico, { backgroundColor: c.surface2 }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: c.ink }]}>{name}</Text>
        <Text style={[styles.meta, { color: c.smoke }]}>{meta}</Text>
      </View>
      <Text style={[styles.amt, { color: type === 'income' ? c.mint : c.ink }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  ico: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '600' },
  meta: { fontSize: 11, marginTop: 1 },
  amt: { fontSize: 13.5, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
