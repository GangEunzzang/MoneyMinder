import { router } from 'expo-router';
import { type ReactNode, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findMission, targetLabel } from '@/entities/mission/model';
import { useMissions } from '@/entities/mission/store';
import { filterMonth, monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import {
  badgeStates,
  currentStreak,
  earnedCount,
  missionProgress,
  noSpendDaysInMonth,
  noSpendSavings,
  startOfWeek,
  StreakCard,
  weekProgress,
  WeekDots,
} from '@/features/mission';
import { weekdayIndex, won } from '@/shared/lib/format';
import { type ColorName, radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Card,
  ConfirmDialog,
  IconAward,
  IconChevronRight,
  IconPiggy,
  IconSettings,
  IconTarget,
  IconTrophy,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

const TAB_CLEARANCE = 96;

export default function MissionScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const active = useMissions((s) => s.active);
  const weeklyGoal = useMissions((s) => s.weeklyGoal);
  const celebrated = useMissions((s) => s.celebrated);
  const seenBadges = useMissions((s) => s.seenBadges);
  const seeBadges = useMissions((s) => s.seeBadges);

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

  const badges = useMemo(
    () => badgeStates(transactions, monthKey(new Date()), new Date(), celebrated.length),
    [transactions, celebrated],
  );

  const otherLabel = view.other
    ? `${view.other.spec.title} ${view.other.progress.done}/${targetLabel(view.other.spec, view.other.progress.target)}`
    : '무지출 외에 다른 목표도 함께';

  const fresh = badges.filter((b) => b.earned && !seenBadges.includes(b.id));
  const newest = fresh[fresh.length - 1] ?? null;

  return (
    <>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + TAB_CLEARANCE },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Row between center>
        <Text variant="title3">미션</Text>
        <Pressable onPress={() => router.push('/missions/settings')} hitSlop={10}>
          <IconSettings size={20} color={c.inkSoft} />
        </Pressable>
      </Row>

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

      <Row gap="lg">
        <EntryCard
          tone="violetSoft"
          icon={<IconPiggy size={22} color={c.violetDeep} />}
          title="무지출 저금통"
          subtitle={view.savings ? `${won(view.savings.amount)}원 모았어요` : '조금만 더 기록하면'}
          onPress={() => router.push('/missions/jar')}
        />
        <EntryCard
          tone="peachSoft"
          icon={<IconTrophy size={20} color={c.peach} />}
          title="배지 컬렉션"
          subtitle={`${earnedCount(badges)}/${badges.length}개 획득`}
          onPress={() => router.push('/missions/badges')}
        />
      </Row>

      <Card style={styles.weekly}>
        <Stack gap="xl">
          <Row between center>
            <Text variant="bodyBold">이번 주 미션</Text>
            <Text variant="microBold" color="violetDeep">
              주 {weeklyGoal}일 · {view.achieved}/{weeklyGoal}
            </Text>
          </Row>

          <WeekDots week={view.week} todayIndex={view.todayIndex} />

          <Text variant="micro" color="smoke" style={styles.hint}>
            {view.achieved >= weeklyGoal
              ? '이번 주 목표를 달성했어요'
              : view.spentToday
                ? `오늘은 지출이 있어요 · ${weeklyGoal - view.achieved}일 더 성공하면 목표 달성`
                : '오늘 무지출이면 미션 달성!'}
          </Text>
        </Stack>
      </Card>

      <Pressable
        onPress={() => router.push('/missions/badges')}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      >
        <Card style={styles.badges}>
          <Row between center>
            <Stack gap="xxs">
              <Text variant="bodyBold">배지 컬렉션</Text>
              <Text variant="micro" color="smoke">
                {earnedCount(badges)}/{badges.length}개 획득
              </Text>
            </Stack>
            <Row gap="md" center>
              {badges
                .filter((b) => b.earned)
                .slice(0, 3)
                .map((b) => (
                  <View key={b.id} style={[styles.badgeDot, { backgroundColor: c.violetSoft }]}>
                    <Text variant="nano" color="violet">
                      {b.label.slice(0, 2)}
                    </Text>
                  </View>
                ))}
              <IconChevronRight size={16} color={c.mist} />
            </Row>
          </Row>
        </Card>
      </Pressable>
    </ScrollView>

      <ConfirmDialog
        visible={newest != null}
        icon={<IconAward size={24} color={c.violet} />}
        iconTone="violetSoft"
        tone="primary"
        title={`${newest?.label ?? ''} 배지 획득!`}
        message={`${newest?.hint ?? ''}\n배지 컬렉션에서 모은 배지를 볼 수 있어요`}
        cancelLabel="확인"
        confirmLabel="보러 가기"
        onCancel={() => seeBadges(fresh.map((b) => b.id))}
        onConfirm={() => {
          seeBadges(fresh.map((b) => b.id));
          router.push('/missions/badges');
        }}
      />
    </>
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
  badges: { padding: space['3xl'] },
  badgeDot: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { textAlign: 'center' },
  pressed: { opacity: 0.6 },
});
