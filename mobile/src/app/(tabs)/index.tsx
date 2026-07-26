import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetTrack, StreakCard, type WeekDay } from '@/components/mission';
import { TxnRow } from '@/components/TxnRow';
import { Card, Eyebrow } from '@/components/base';
import { IconCafe, IconFlame } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { formatWon, useLedger } from '@/store/ledger';

const WEEK: WeekDay[] = [
  { label: '월', state: 'done' },
  { label: '화', state: 'done' },
  { label: '수', state: 'empty' },
  { label: '목', state: 'done' },
  { label: '금', state: 'today' },
  { label: '토', state: 'empty' },
  { label: '일', state: 'empty' },
];

export default function HomeScreen() {
  const c = useTheme();
  const ledger = useLedger();
  const budgetPercent = Math.round((ledger.spent / ledger.budget) * 100);
  const budgetLeft = ledger.budget - ledger.spent;
  const week = WEEK.map((day) => (day.state === 'today' && ledger.hasExpenseToday ? { ...day, state: 'empty' as const } : day));

  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <SafeAreaView edges={['top']} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.name, { color: c.ink }]}>은짱님</Text>
              <Text style={[styles.date, { color: c.smoke }]}>8월 12일 화요일</Text>
            </View>
            <View style={[styles.avatar, { backgroundColor: c.surface2 }]} />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Eyebrow>8월 지출</Eyebrow>
            <Text style={[styles.hero, { color: c.ink }]}>
              {formatWon(ledger.spent)}
              <Text style={[styles.heroUnit, { color: c.smoke }]}>원</Text>
            </Text>
          </View>

          <Card style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
            <View style={styles.rowBetween}>
              <Text style={[styles.cardTitle, { color: c.ink }]}>8월 예산</Text>
              <Text style={[styles.pct, { color: c.smoke }]}>{budgetPercent}%</Text>
            </View>
            <View style={{ marginTop: 9 }}>
              <BudgetTrack percent={budgetPercent} />
            </View>
            <View style={[styles.rowBetween, { marginTop: 7 }]}>
              <Text style={[styles.small, { color: c.smoke }]}>{formatWon(budgetLeft)}원 남음</Text>
              <Text style={[styles.smallAmt, { color: c.smoke }]}>
                {formatWon(ledger.spent)} / {formatWon(ledger.budget)}
              </Text>
            </View>
          </Card>

          <View style={{ marginTop: 11 }}>
            <StreakCard count={ledger.currentStreak} longest={21} week={week} />
          </View>

          <Card style={styles.todayCard}>
            <View style={[styles.miniIco, { backgroundColor: c.mintSoft }]}>
              <IconFlame size={17} color={c.mint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.todayTitle, { color: c.ink }]}>
                {ledger.hasExpenseToday ? '오늘은 지출이 있어요' : '오늘 아직 무지출이에요'}
              </Text>
              <Text style={[styles.small, { color: c.smoke, marginTop: 1 }]}>
                {ledger.hasExpenseToday ? '다음 무지출부터 다시 시작해요' : `이대로면 ${ledger.currentStreak + 1}일째 · 지금 15:20`}
              </Text>
            </View>
          </Card>

          <Text style={[styles.section, { color: c.ink }]}>최근 기록</Text>
          {ledger.transactions.slice(0, 4).map((transaction) => (
            <TxnRow
              key={transaction.id}
              name={transaction.merchant}
              meta={`${transaction.category} · ${transaction.dateLabel}`}
              amount={`${transaction.type === 'expense' ? '-' : '+'}${formatWon(transaction.amount)}`}
              type={transaction.type}
              icon={<IconCafe size={16} color={c.inkSoft} />}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { paddingHorizontal: 15, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 12 },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4 },
  date: { fontSize: 11, marginTop: 1 },
  avatar: { width: 34, height: 34, borderRadius: 11 },
  hero: { fontSize: 29, fontWeight: '800', letterSpacing: -0.9, marginTop: 2, fontVariant: ['tabular-nums'] },
  heroUnit: { fontSize: 16, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 12.5, fontWeight: '600' },
  pct: { fontSize: 11, fontWeight: '700' },
  small: { fontSize: 11.5, fontWeight: '600' },
  smallAmt: { fontSize: 11.5, fontWeight: '600', fontVariant: ['tabular-nums'] },
  todayCard: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  miniIco: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  todayTitle: { fontSize: 13.5, fontWeight: '700' },
  section: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3, marginTop: 16, marginBottom: 2 },
});
