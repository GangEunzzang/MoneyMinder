import { router } from 'expo-router';
import { type ReactNode, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findMission, targetLabel } from '@/entities/mission/model';
import { useMissions } from '@/entities/mission/store';
import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import {
  Badge,
  currentStreak,
  missionProgress,
  noSpendDaysInMonth,
  noSpendSavings,
  startOfWeek,
  StreakCard,
  weekProgress,
} from '@/features/mission';
import { KOREAN_WEEKDAYS, weekdayIndex } from '@/shared/lib/format';
import { type ColorName, radius, screenPadding, space, useColors } from '@/shared/theme';
import { Card, IconCheck, IconPiggy, IconTarget, Row, Stack, Text } from '@/shared/ui';

const BADGE_DAYS = [7, 14, 30, 100];
const WEEKLY_GOAL = 4;
const TAB_CLEARANCE = 96;

export default function MissionScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const active = useMissions((s) => s.active);

  const view = useMemo(() => {
    const today = new Date();
    const ym = monthKey(today);
    const { done, achieved } = weekProgress(transactions, startOfWeek(today), today);
    const noSpend = noSpendDaysInMonth(transactions, ym, today);
    const other = active.find((m) => m.id !== 'no-spend');
    const otherSpec = other ? findMission(other.id) : undefined;

    return {
      week: done,
      achieved,
      noSpend,
      savings: noSpendSavings(filterMonth(transactions, ym), noSpend),
      streak: currentStreak(transactions, today),
      todayIndex: weekdayIndex(today),
      spentToday: !done[weekdayIndex(today)],
      other:
        other && otherSpec
          ? { spec: otherSpec, progress: missionProgress(otherSpec, other, transactions, today) }
          : null,
    };
  }, [transactions, active]);

  const otherLabel = view.other
    ? `${view.other.spec.title} ${view.other.progress.done}/${targetLabel(view.other.spec, view.other.progress.target)}`
    : '무지출 외에 다른 목표도 함께';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + TAB_CLEARANCE },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title3">미션</Text>

      <StreakCard
        streak={view.streak}
        longest={21}
        week={view.week}
        todayIndex={view.todayIndex}
        showVerify
      />

      <Row gap="lg">
        <EntryCard
          tone="violetSoft"
          icon={<IconPiggy size={22} color={c.violet} />}
          title="무지출 캘린더"
          subtitle={`이번 달 무지출 ${view.noSpend}일`}
          onPress={() => router.push('/missions/calendar')}
        />
        <EntryCard
          tone="mintSoft"
          icon={<IconTarget size={20} color={c.mint} />}
          title="다른 미션 둘러보기"
          subtitle={otherLabel}
          onPress={() => router.push('/missions')}
        />
      </Row>

      <Card style={styles.weekly}>
        <Stack gap="xl">
          <Row between center>
            <Text variant="bodyBold">이번 주 미션</Text>
            <Text variant="microBold" color="violetDeep">
              주 {WEEKLY_GOAL}일 · {view.achieved}/{WEEKLY_GOAL}
            </Text>
          </Row>

          <Row between>
            {KOREAN_WEEKDAYS.map((label, i) => {
              const done = view.week[i];
              const today = i === view.todayIndex;

              return (
                <Stack key={label} gap="sm" center>
                  <Text variant="nanoSoft" color="smoke">
                    {label}
                  </Text>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: done ? c.violet : today ? c.violetSoft : c.surface2 },
                      today && !done ? { borderWidth: 2, borderColor: c.violet } : null,
                    ]}
                  >
                    {done ? <IconCheck size={15} color={c.onColor} strokeWidth={2.6} /> : null}
                  </View>
                </Stack>
              );
            })}
          </Row>

          <Text variant="micro" color="smoke" style={styles.hint}>
            {view.achieved >= WEEKLY_GOAL
              ? '이번 주 목표를 달성했어요'
              : view.spentToday
                ? `오늘은 지출이 있어요 · ${WEEKLY_GOAL - view.achieved}일 더 성공하면 목표 달성`
                : '오늘 무지출이면 미션 달성!'}
          </Text>
        </Stack>
      </Card>

      <Row between>
        {BADGE_DAYS.map((days) => (
          <Badge key={days} days={days} streak={view.streak} />
        ))}
      </Row>
    </ScrollView>
  );
}

function EntryCard({
  tone,
  icon,
  title,
  subtitle,
  onPress,
}: {
  tone: ColorName;
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const c = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.entry, pressed ? styles.pressed : undefined]}
    >
      <Card style={styles.entryCard}>
        <Stack gap="md">
          <View style={[styles.entryIcon, { backgroundColor: c[tone] }]}>{icon}</View>
          <Stack gap="xxs">
            <Text variant="bodyBold" numberOfLines={1}>
              {title}
            </Text>
            <Text variant="micro" color="smoke" numberOfLines={1}>
              {subtitle}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding, gap: space['3xl'] },
  entry: { flex: 1 },
  entryCard: { padding: space.xl },
  entryIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekly: { paddingVertical: space['2xl'], paddingHorizontal: space['3xl'] },
  dot: {
    width: 28,
    height: 28,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { textAlign: 'center' },
  pressed: { opacity: 0.6 },
});
