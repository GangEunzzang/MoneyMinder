import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { IconCheck, IconFlame } from './icons';

export type DayState = 'done' | 'today' | 'empty';
export type WeekDay = { label: string; state: DayState };

export function WeekProgress({ days, onDark }: { days: WeekDay[]; onDark?: boolean }) {
  const c = useTheme();
  return (
    <View style={styles.week}>
      {days.map((d, i) => {
        const bg = onDark
          ? d.state === 'today'
            ? 'rgba(255,255,255,0.34)'
            : d.state === 'done'
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(255,255,255,0.12)'
          : d.state === 'today'
            ? c.violetSoft
            : d.state === 'done'
              ? c.violet
              : c.surface2;
        const fg = onDark ? '#fff' : d.state === 'today' ? c.violetDeep : d.state === 'done' ? '#fff' : c.smoke;
        return (
          <View key={i} style={[styles.wd, { backgroundColor: bg }]}>
            <Text style={[styles.wdLabel, { color: fg }]}>{d.label}</Text>
            <View
              style={[
                styles.wdDot,
                d.state === 'done'
                  ? { backgroundColor: onDark ? '#fff' : c.violet, borderColor: onDark ? '#fff' : c.violet }
                  : { borderColor: onDark ? 'rgba(255,255,255,0.6)' : c.mist },
              ]}>
              {d.state === 'done' && <IconCheck size={8} color={onDark ? c.violet : '#fff'} strokeWidth={4} />}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function BudgetTrack({ percent }: { percent: number }) {
  const c = useTheme();
  const p = Math.min(100, Math.max(0, percent));
  const fill = p >= 100 ? c.red : p >= 80 ? c.peach : c.violet;
  return (
    <View style={[styles.track, { backgroundColor: c.hairStrong }]}>
      <View style={{ width: `${p}%`, height: '100%', borderRadius: 99, backgroundColor: fill }} />
    </View>
  );
}

export function StreakCard({
  count,
  longest,
  week,
}: {
  count: number;
  longest?: number;
  week?: WeekDay[];
}) {
  const c = useTheme();
  return (
    <View style={[styles.streak, { backgroundColor: c.violet }]}>
      <View style={styles.streakHead}>
        <IconFlame size={17} color="#fff" />
        <Text style={styles.streakLabel}>연속 무지출</Text>
      </View>
      <Text style={styles.streakNum}>
        {count}
        <Text style={styles.streakUnit}>일째</Text>
      </Text>
      {longest != null && <Text style={styles.streakSub}>최장 {longest}일</Text>}
      {week && (
        <View style={{ marginTop: 12 }}>
          <WeekProgress days={week} onDark />
        </View>
      )}
    </View>
  );
}

export function Badge({ earned, size = 42 }: { earned?: boolean; size?: number }) {
  const c = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: earned ? c.violetSoft : c.surface2,
        opacity: earned ? 1 : 0.5,
      }}>
      <IconFlame size={20} color={earned ? c.violetDeep : c.mist} />
    </View>
  );
}

const styles = StyleSheet.create({
  week: { flexDirection: 'row', gap: 5 },
  wd: { flex: 1, aspectRatio: 0.8, borderRadius: 9, alignItems: 'center', justifyContent: 'center', gap: 3 },
  wdLabel: { fontSize: 10, fontWeight: '700' },
  wdDot: { width: 15, height: 15, borderRadius: 99, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  track: { height: 6, borderRadius: 99, overflow: 'hidden' },
  streak: { borderRadius: 18, paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  streakHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakLabel: { color: '#fff', fontSize: 12, fontWeight: '600', opacity: 0.92 },
  streakNum: { color: '#fff', fontSize: 44, fontWeight: '800', letterSpacing: -1.5, marginTop: 2, lineHeight: 46, fontVariant: ['tabular-nums'] },
  streakUnit: { fontSize: 20, fontWeight: '700', opacity: 0.9 },
  streakSub: { color: '#fff', opacity: 0.9, fontSize: 11.5, marginTop: 4 },
});
