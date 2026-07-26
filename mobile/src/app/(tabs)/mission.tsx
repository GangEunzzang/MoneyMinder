import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/base';
import { Badge, StreakCard, WeekProgress, type WeekDay } from '@/components/mission';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/store/ledger';

const WEEK: WeekDay[] = [
  { label: '월', state: 'done' },
  { label: '화', state: 'done' },
  { label: '수', state: 'empty' },
  { label: '목', state: 'done' },
  { label: '금', state: 'today' },
  { label: '토', state: 'empty' },
  { label: '일', state: 'empty' },
];

export default function MissionScreen() {
  const c = useTheme();
  const ledger = useLedger();
  const week = WEEK.map((day) => (day.state === 'today' && ledger.hasExpenseToday ? { ...day, state: 'empty' as const } : day));
  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <SafeAreaView edges={['top']} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: c.ink }]}>무지출 미션</Text>

          <StreakCard count={ledger.currentStreak} longest={21} />

          <Card style={{ marginTop: 12, paddingVertical: 13, paddingHorizontal: 14 }}>
            <View style={styles.rowBetween}>
              <Text style={[styles.section, { color: c.ink }]}>이번 주 미션</Text>
              <Text style={[styles.progress, { color: c.violetDeep }]}>주 4일 · 3/4</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <WeekProgress days={week} />
            </View>
            <Text style={[styles.hint, { color: c.smoke }]}>
              {ledger.hasExpenseToday ? (
                '오늘은 지출이 있어요 · 다음 무지출부터 다시 도전해요'
              ) : (
                <>
                  오늘 무지출이면 <Text style={{ color: c.violetDeep, fontWeight: '700' }}>미션 달성!</Text>
                </>
              )}
            </Text>
          </Card>

          <Text style={[styles.section, { color: c.ink, marginTop: 16, marginBottom: 8 }]}>배지</Text>
          <View style={styles.badges}>
            <View style={styles.badgeCol}>
              <Badge earned />
              <Text style={[styles.badgeLabel, { color: c.ink }]}>7일</Text>
            </View>
            <View style={styles.badgeCol}>
              <Badge earned />
              <Text style={[styles.badgeLabel, { color: c.ink }]}>14일</Text>
            </View>
            <View style={styles.badgeCol}>
              <Badge />
              <Text style={[styles.badgeLabel, { color: c.ink }]}>30일</Text>
            </View>
            <View style={styles.badgeCol}>
              <Badge />
              <Text style={[styles.badgeLabel, { color: c.ink }]}>100일</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { paddingHorizontal: 15, paddingTop: 8, paddingBottom: 30 },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4, paddingBottom: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  progress: { fontSize: 11.5, fontWeight: '700' },
  hint: { fontSize: 11.5, fontWeight: '600', textAlign: 'center', marginTop: 10 },
  badges: { flexDirection: 'row', gap: 9 },
  badgeCol: { flex: 1, alignItems: 'center', gap: 5 },
  badgeLabel: { fontSize: 10.5, fontWeight: '700' },
});
