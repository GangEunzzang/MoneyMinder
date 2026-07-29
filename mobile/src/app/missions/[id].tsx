import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { findMission, PERIOD_LABEL, targetLabel } from '@/entities/mission/model';
import { celebrationKey, useMissions } from '@/entities/mission/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { isExpense, type Transaction } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { completion, missionProgress, remainingLabel, startOfWeek } from '@/features/mission';
import { KOREAN_WEEKDAYS, signedWon, toDateKey, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  CategoryIcon,
  ListRow,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

export default function MissionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const spec = findMission(id);
  const active = useMissions((s) => s.active.find((m) => m.id === id));
  const stop = useMissions((s) => s.stop);
  const celebrated = useMissions((s) => s.celebrated);
  const transactions = useLedger((s) => s.transactions);
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);

  const done = useMemo(
    () => (spec && active ? completion(spec, active, transactions, new Date()) : null),
    [spec, active, transactions],
  );

  /**
   * 완주는 회차가 닫힌 뒤 계속 참이라 화면에 들어올 때마다 검사해야 놓치지 않는다.
   * 축하 화면이 회차를 celebrated 에 남기므로 두 번 열리지는 않는다.
   */
  useFocusEffect(
    useCallback(() => {
      if (!spec || !done) return;
      if (celebrated.includes(celebrationKey(spec.id, done.periodKey))) return;
      router.push(`/missions/complete/${spec.id}`);
    }, [spec, done, celebrated]),
  );

  const view = useMemo(() => {
    if (!spec || !active) return null;
    const today = new Date();
    const from = startOfWeek(today);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const key = toDateKey(d);
      const hits = transactions.filter(
        (t) => t.date === key && isExpense(t) && (spec.categoryId == null || t.categoryId === spec.categoryId),
      );

      return { key, future: key > toDateKey(today), count: hits.length };
    });

    return {
      progress: missionProgress(spec, active, transactions, today),
      days,
      rows: transactions
        .filter(
          (t) =>
            t.date >= toDateKey(from) &&
            t.date <= toDateKey(today) &&
            isExpense(t) &&
            (spec.categoryId == null || t.categoryId === spec.categoryId),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
      methodName: new Map(methods.map((m) => [m.id, m.name])),
    };
  }, [spec, active, transactions, methods]);

  if (!spec || !active || !view) {
    return (
      <Stack center style={styles.empty}>
        <Text variant="body" color="smoke">
          진행 중이 아닌 미션이에요
        </Text>
      </Stack>
    );
  }

  const { progress } = view;

  const onStop = () =>
    Alert.alert(`${spec.title}을 그만둘까요?`, '기록한 내역은 그대로 남아요', [
      { text: '계속하기', style: 'cancel' },
      {
        text: '그만두기',
        style: 'destructive',
        onPress: () => {
          stop(spec.id);
          router.back();
        },
      },
    ]);

  const renderRow = (t: Transaction, i: number) => {
    const cat = findCategory(categories, t.categoryId);
    const day = KOREAN_WEEKDAYS[(new Date(t.date).getDay() + 6) % 7];
    const method = t.paymentMethodId ? view.methodName.get(t.paymentMethodId) : null;

    return (
      <ListRow
        key={t.id}
        leading={<CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />}
        title={t.merchant || cat.label}
        subtitle={method ? `${day}요일 · ${method}` : `${day}요일`}
        value={signedWon(-t.amount)}
        divider={i > 0}
      />
    );
  };

  return (
    <>
      <ScreenHeader title={spec.title} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="caption" color="smoke" style={styles.eyebrow}>
          {PERIOD_LABEL[active.period]} 진행
        </Text>
        <Row gap="xs" style={styles.count}>
          <NumText variant="title1" color={progress.achieved ? spec.tint : 'red'}>
            {spec.unit === 'won' ? won(progress.done) : progress.done}
          </NumText>
          <Text variant="title3Soft" color="smoke">
            / {targetLabel(spec, progress.target)}
          </Text>
        </Row>
        <Text variant="micro" color={progress.achieved ? 'violetDeep' : 'red'}>
          {remainingLabel(spec, progress)}
        </Text>

        <ProgressBar
          value={progress.ratio}
          height={9}
          color={progress.achieved ? spec.tint : 'red'}
        />

        <Row between style={styles.week}>
          {view.days.map((d, i) => (
            <Stack key={d.key} gap="md" center style={styles.day}>
              <Text variant="nanoSoft" color="mist">
                {KOREAN_WEEKDAYS[i]}
              </Text>
              <Stack
                center
                style={[
                  styles.dot,
                  {
                    backgroundColor: d.future
                      ? c.surface2
                      : d.count > 0
                        ? c[spec.tintSoft]
                        : c.mintSoft,
                  },
                ]}
              >
                {d.future ? null : d.count > 0 ? (
                  <NumText variant="nano" color={spec.tint}>
                    {d.count}
                  </NumText>
                ) : (
                  <View style={[styles.check, { backgroundColor: c.mint }]} />
                )}
              </Stack>
            </Stack>
          ))}
        </Row>
        <Text variant="micro" color="mist" style={styles.legend}>
          숫자는 그날 쓴 횟수, 초록은 안 쓴 날이에요
        </Text>

        <SectionHeader title="이번 주 기록" meta={`${view.rows.length}건`} />
        {view.rows.length === 0 ? (
          <Text variant="micro" color="mist" style={styles.none}>
            이번 주엔 아직 기록이 없어요
          </Text>
        ) : (
          view.rows.map(renderRow)
        )}

        <Spring />
        <Button label="미션 그만두기" variant="danger" onPress={onStop} style={styles.cta} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  eyebrow: { paddingTop: space['3xl'] },
  count: { alignItems: 'baseline', paddingTop: space.xs },
  week: { paddingTop: space['5xl'] },
  day: { flex: 1 },
  dot: { width: 32, height: 32, borderRadius: radius.pill },
  check: { width: 9, height: 9, borderRadius: radius.pill },
  legend: { paddingTop: space['3xl'] },
  none: { paddingVertical: space['4xl'] },
  cta: { marginTop: space['4xl'] },
  empty: { flex: 1 },
});
