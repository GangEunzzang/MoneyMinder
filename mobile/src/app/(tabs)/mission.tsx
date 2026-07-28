import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import {
  Badge,
  currentStreak,
  noSpendDaysInMonth,
  noSpendSavings,
  startOfWeek,
  StreakCard,
  weekProgress,
} from '@/features/mission';
import { percent, weekdayIndex, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  IconChevronRight,
  ListRow,
  NumText,
  ProgressBar,
  Row,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

const BADGE_DAYS = [7, 14, 30, 100];
const WEEKLY_GOAL = 4;
const JAR_GOAL = 100_000;
/** noSpendSavings 가 요구하는 최소 표본. 안내 문구에서 같은 수를 말해준다. */
const MIN_DAYS = 5;

export default function MissionScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);

  const view = useMemo(() => {
    const today = new Date();
    const ym = monthKey(today);
    const { done, achieved } = weekProgress(transactions, startOfWeek(today), today);
    const noSpend = noSpendDaysInMonth(transactions, ym, today);

    return {
      week: done,
      achieved,
      noSpend,
      savings: noSpendSavings(filterMonth(transactions, ym), noSpend),
      streak: currentStreak(transactions, today),
      todayIndex: weekdayIndex(today),
      spentToday: !done[weekdayIndex(today)],
    };
  }, [transactions]);

  const left = Math.max(0, WEEKLY_GOAL - view.achieved);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + 96 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title3" style={styles.title}>
        미션
      </Text>

      <StreakCard streak={view.streak} longest={21} week={view.week} todayIndex={view.todayIndex} />

      <SectionHeader title={`이번 주 미션 · 주 ${WEEKLY_GOAL}일`} meta={`${view.achieved}/${WEEKLY_GOAL}`} accent />
      <Stack gap="xl">
        <ProgressBar value={view.achieved / WEEKLY_GOAL} height={7} />
        <Text variant="micro" color="smoke">
          {left === 0
            ? '이번 주 목표를 달성했어요'
            : view.spentToday
              ? `오늘은 지출이 있어요 · ${left}일 더 성공하면 목표 달성`
              : '오늘 무지출이면 하루 더 쌓여요'}
        </Text>
      </Stack>

      <SectionHeader
        title="무지출 저금통"
        meta={view.savings ? `목표 ${percent(view.savings.amount, JAR_GOAL)}%` : undefined}
      />
      <Stack gap="lg" style={[styles.jar, { backgroundColor: c.violetSoft }]}>
        {view.savings ? (
          <>
            <Row between center>
              <NumText variant="title3" color="violetDeep">
                {won(view.savings.amount)}원
              </NumText>
              <Text variant="micro" color="violetDeep">
                무지출 {view.noSpend}일
              </Text>
            </Row>
            <ProgressBar value={view.savings.amount / JAR_GOAL} height={6} color="violet" />
            <Text variant="micro" color="smoke">
              평소 하루 쓰던 만큼을 안 쓴 날마다 모았어요
            </Text>
          </>
        ) : (
          <>
            <Text variant="bodyBold" color="violetDeep">
              조금만 더 기록하면 보여드릴게요
            </Text>
            <Text variant="micro" color="smoke">
              평소 얼마 쓰는지 알아야 얼마 아꼈는지도 셀 수 있어요. 지출한 날 {MIN_DAYS}일치면 충분해요.
            </Text>
          </>
        )}
      </Stack>

      <SectionHeader
        title="다른 미션"
        meta="둘러보기"
        accent
      />
      <ListRow
        title="미션 고르기"
        subtitle="카페 다이어트 · 예산 지키기 · 배달 줄이기"
        trailing={<IconChevronRight size={16} color={c.mist} />}
        onPress={() => router.push('/missions')}
      />

      <SectionHeader title="배지" meta={`${BADGE_DAYS.filter((d) => view.streak >= d).length}/${BADGE_DAYS.length}`} />
      <Row gap="lg" style={styles.badges}>
        {BADGE_DAYS.map((days) => (
          <Badge key={days} days={days} streak={view.streak} />
        ))}
      </Row>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding },
  title: { paddingBottom: space['3xl'] },
  jar: { padding: space['4xl'], borderRadius: radius.card },
  badges: { alignItems: 'flex-start' },
});
