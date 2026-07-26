import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/base';
import { IconChevronRight } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/store/ledger';

function Row({ label, value, last }: { label: string; value?: ReactNode; last?: boolean }) {
  const c = useTheme();
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: c.hair }]}>
      <Text style={[styles.rowLabel, { color: c.ink }]}>{label}</Text>
      {typeof value === 'string' ? <Text style={[styles.rowValue, { color: c.smoke }]}>{value}</Text> : value}
      <IconChevronRight size={16} color={c.mist} />
    </View>
  );
}

function ToggleView({ on }: { on: boolean }) {
  const c = useTheme();
  return (
    <View style={[styles.toggle, { backgroundColor: on ? c.violet : c.hairStrong }]}>
      <View style={[styles.knob, on ? { right: 3 } : { left: 3 }]} />
    </View>
  );
}

export default function SettingsScreen() {
  const c = useTheme();
  const ledger = useLedger();
  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <SafeAreaView edges={['top']} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.pad} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: c.ink }]}>전체</Text>

          <Card style={styles.profile}>
            <View style={[styles.avatar, { backgroundColor: c.violet }]}>
              <Text style={styles.avatarText}>강</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pName, { color: c.ink }]}>은짱</Text>
              <Text style={[styles.pSub, { color: c.smoke }]}>연속 무지출 {ledger.currentStreak}일째</Text>
            </View>
            <IconChevronRight size={18} color={c.mist} />
          </Card>

          <Card style={styles.group}>
            <Row label="월 예산" value="1,200,000" />
            <Row label="무지출 미션" value="주 4일" />
            <Row label="카테고리 관리" last />
          </Card>

          <Card style={styles.group}>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: c.hair }]}>
              <Text style={[styles.rowLabel, { color: c.ink }]}>무지출 리마인더</Text>
              <View style={{ marginLeft: 'auto' }}>
                <ToggleView on />
              </View>
            </View>
            <Row label="다크 모드" value="시스템" last />
          </Card>

          <Card style={styles.group}>
            <Row label="데이터 내보내기 (CSV)" last />
          </Card>
          <Card style={[styles.group, { paddingVertical: 2 }]}>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: c.smoke }]}>로그아웃</Text>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pad: { paddingHorizontal: 15, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4, paddingVertical: 8 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  pName: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  pSub: { fontSize: 11.5, marginTop: 1 },
  group: { marginTop: 12, paddingVertical: 2, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11 },
  rowLabel: { fontSize: 13.5, fontWeight: '600' },
  rowValue: { fontSize: 12, fontWeight: '600', marginLeft: 'auto' },
  toggle: { width: 40, height: 24, borderRadius: 99, justifyContent: 'center' },
  knob: { position: 'absolute', top: 3, width: 18, height: 18, borderRadius: 99, backgroundColor: '#fff' },
});
