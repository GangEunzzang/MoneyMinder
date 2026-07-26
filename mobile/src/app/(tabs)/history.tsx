import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/base';
import { IconCafe } from '@/components/icons';
import { TxnRow } from '@/components/TxnRow';
import { useTheme } from '@/hooks/use-theme';
import { formatWon, useLedger } from '@/store/ledger';

export default function HistoryScreen() {
  const c = useTheme();
  const ledger = useLedger();
  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <SafeAreaView edges={['top']} style={styles.fill}>
        <View style={styles.pad}>
          <Text style={[styles.title, { color: c.ink }]}>8월</Text>
          <Card style={styles.summary}>
            <View style={styles.sumCol}>
              <Text style={[styles.sumLabel, { color: c.mint }]}>수입</Text>
              <Text style={[styles.sumAmt, { color: c.mint }]}>+{formatWon(ledger.income)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: c.hairStrong }]} />
            <View style={styles.sumCol}>
              <Text style={[styles.sumLabel, { color: c.red }]}>지출</Text>
              <Text style={[styles.sumAmt, { color: c.ink }]}>-{formatWon(ledger.spent)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: c.hairStrong }]} />
            <View style={styles.sumCol}>
              <Text style={[styles.sumLabel, { color: c.smoke }]}>무지출</Text>
              <Text style={[styles.sumAmt, { color: c.violet }]}>{ledger.noSpendDays}일</Text>
            </View>
          </Card>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.day, { color: c.smoke }]}>최근 기록</Text>
          {ledger.transactions.map((transaction) => (
            <TxnRow
              key={transaction.id}
              name={transaction.merchant}
              meta={`${transaction.category} · ${transaction.dateLabel}`}
              amount={`${transaction.type === 'expense' ? '-' : '+'}${formatWon(transaction.amount)}`}
              type={transaction.type}
              icon={<IconCafe size={16} color={c.inkSoft} />}
            />
          ))}
          {ledger.hasExpenseToday ? (
            <View style={styles.noSpend}>
              <View style={[styles.dot, { backgroundColor: c.red }]} />
              <Text style={[styles.noSpendText, { color: c.smoke }]}>오늘 · 지출 있음</Text>
            </View>
          ) : null}
          <View style={styles.noSpend}>
            <View style={[styles.dot, { backgroundColor: c.violet }]} />
            <Text style={[styles.noSpendText, { color: c.smoke }]}>8월 5일 · 무지출 성공</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pad: { paddingHorizontal: 15, paddingTop: 8 },
  scroll: { paddingHorizontal: 15, paddingBottom: 30 },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4, paddingBottom: 10 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14 },
  sumCol: { alignItems: 'flex-start' },
  sumLabel: { fontSize: 11, fontWeight: '700' },
  sumAmt: { fontSize: 14, fontWeight: '800', marginTop: 2, fontVariant: ['tabular-nums'] },
  divider: { width: 1 },
  day: { fontSize: 11, fontWeight: '700', paddingTop: 14, paddingBottom: 1 },
  noSpend: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  dot: { width: 8, height: 8, borderRadius: 99 },
  noSpendText: { fontSize: 11.5, fontWeight: '700' },
});
