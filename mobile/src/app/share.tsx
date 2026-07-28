import { Stack as NavStack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet } from 'react-native';

import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak, noSpendDaysInMonth, noSpendSavings } from '@/features/mission';
import { headline, monthlyReport } from '@/features/report';
import { type ColorName, radius, screenPadding, space, useColors } from '@/shared/theme';
import { won } from '@/shared/lib/format';
import { Button, NumText, Row, Stack, Text } from '@/shared/ui';

const TONES: ColorName[] = ['violet', 'violetDeep', 'mint', 'peach'];

export default function ShareScreen() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);
  const [tone, setTone] = useState<ColorName>('violet');

  const view = useMemo(() => {
    const today = new Date();
    const ym = monthKey(today);
    const noSpend = noSpendDaysInMonth(transactions, ym, today);

    return {
      ym,
      report: monthlyReport(transactions, ym),
      noSpend,
      savings: noSpendSavings(filterMonth(transactions, ym), noSpend),
      streak: currentStreak(transactions, today),
    };
  }, [transactions]);

  const month = Number(view.ym.slice(5));

  /** 공유는 사용자가 스스로 보내는 것 — 앱이 대신 올리지 않는다. */
  const onShare = () =>
    Share.share({
      message: [
        `${month}월 가계부 결산`,
        headline(view.report),
        `무지출 ${view.noSpend}일 · 최장 스트릭 ${view.streak}일`,
        `총 지출 ${won(view.report.expense)}원`,
        '— MoneyMinder',
      ].join('\n'),
    });

  const metric = (label: string, value: string) => (
    <Stack gap="xs" style={styles.metric}>
      <Text variant="nanoSoft" style={{ color: c.onColor, opacity: 0.7 }}>
        {label}
      </Text>
      <NumText variant="subheadFlat" style={{ color: c.onColor }}>
        {value}
      </NumText>
    </Stack>
  );

  return (
    <>
      <NavStack.Screen options={{ title: '결산 공유' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stack gap="5xl" style={[styles.card, { backgroundColor: c[tone] }]}>
          <Text variant="caption" style={{ color: c.onColor, opacity: 0.85 }}>
            {month}월 가계부 결산
          </Text>

          <Stack gap="sm">
            <Text variant="micro" style={{ color: c.onColor, opacity: 0.8 }}>
              {view.report.prevExpense > 0 ? '지난달보다' : '이번 달'}
            </Text>
            <Text variant="title2" style={{ color: c.onColor }}>
              {view.report.saved > 0
                ? `${won(view.report.saved)}원 아꼈어요`
                : `${won(view.report.expense)}원 썼어요`}
            </Text>
          </Stack>

          <Row between>
            {metric('무지출', `${view.noSpend}일`)}
            {metric('최장 스트릭', `${view.streak}일`)}
            {metric('총 지출', won(view.report.expense))}
          </Row>

          <Text variant="nanoSoft" style={{ color: c.onColor, opacity: 0.6 }}>
            MoneyMinder
          </Text>
        </Stack>

        <Row gap="md" center style={styles.tones}>
          {TONES.map((t) => (
            <Pressable
              key={t}
              accessibilityRole="button"
              accessibilityLabel={`${t} 배경`}
              onPress={() => setTone(t)}
              style={[
                styles.swatch,
                { backgroundColor: c[t] },
                t === tone ? { borderWidth: 2, borderColor: c.ink } : null,
              ]}
            />
          ))}
        </Row>
        <Text variant="micro" color="mist" style={styles.hint}>
          색을 골라 카드 배경을 바꿀 수 있어요
        </Text>

        <Button label="공유하기" onPress={onShare} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  card: { padding: space['5xl'], borderRadius: radius['3xl'], marginTop: space['3xl'] },
  metric: { flex: 1 },
  tones: { justifyContent: 'center', paddingTop: space['5xl'] },
  swatch: { width: 40, height: 40, borderRadius: radius.pill },
  hint: { textAlign: 'center', paddingTop: space.xl },
  cta: { marginTop: space['5xl'] },
});
