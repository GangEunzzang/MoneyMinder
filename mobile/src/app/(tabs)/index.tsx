import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/entities/app/store';
import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import {
  filterMonth,
  monthKey,
  sumExpense,
  txnMeta,
  txnTitle,
} from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak, startOfWeek, StreakCard, weekProgress } from '@/features/mission';
import { nextAutoCharge, type Upcoming } from '@/features/recurring';
import { useRecurring } from '@/entities/recurring/store';
import {
  dateHeading,
  monthLabel,
  percent,
  signedWon,
  weekdayIndex,
  won,
  wonUnit,
} from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Card,
  CategoryIcon,
  ConfirmDialog,
  IconBell,
  IconChevronRight,
  IconWarning,
  NumText,
  ProgressBar,
  Row,
  Stack,
  Text,
} from '@/shared/ui';

/** 탭바가 떠 있는 만큼 마지막 카드가 가리지 않도록 비워둔다. */
const TAB_CLEARANCE = 96;

/** "오늘/내일"은 날짜보다 먼저 읽힌다. 3일 밖은 날짜가 더 쓸모 있다. */
function chargeLabel(u: Upcoming): string {
  if (u.daysLeft === 0) return '오늘';
  if (u.daysLeft === 1) return '내일';
  if (u.daysLeft <= 3) return `${u.daysLeft}일 뒤`;

  return dateHeading(u.date);
}

export default function HomeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const recurring = useRecurring((s) => s.items);
  const budget = useLedger((s) => s.budget);
  const alerted = useAppState((s) => s.budgetAlerted);
  const alertBudget = useAppState((s) => s.alertBudget);

  const view = useMemo(() => {
    const today = new Date();
    const spent = sumExpense(filterMonth(transactions, monthKey(today)));
    const { done } = weekProgress(transactions, startOfWeek(today), today);

    return {
      spent,
      left: budget - spent,
      ratio: budget > 0 ? spent / budget : 0,
      streak: currentStreak(transactions, today),
      week: done,
      todayIndex: weekdayIndex(today),
      recent: transactions.slice(0, 4),
      charge: nextAutoCharge(recurring, today),
      methodName: new Map(methods.map((m) => [m.id, m.name])),
      ym: monthKey(today),
      month: monthLabel(today),
    };
  }, [transactions, budget, methods, recurring]);

  const over = view.left < 0;
  const warnBudget = over && budget > 0 && !alerted.includes(view.ym);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + TAB_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Row between center>
          <Stack gap="xxs">
            <Text variant="headlineStrong">은짱님 · {view.month}</Text>
            <Text variant="captionMuted" color="smoke">
              오늘도 무지출 도전 중
            </Text>
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="알림"
            onPress={() => router.push('/notifications')}
            hitSlop={8}
            style={[styles.bell, { backgroundColor: c.surface }]}
          >
            <IconBell size={18} color={c.inkSoft} />
          </Pressable>
        </Row>

        <StreakCard
          streak={view.streak}
          longest={21}
          week={view.week}
          todayIndex={view.todayIndex}
          showVerify
          onVerify={() => router.push('/mission')}
        />

        <Stack gap="xl">
          <Text variant="calloutBold">이번 달 지출</Text>
          <Card>
            <Stack gap="xl">
              <Row between style={styles.spendTop}>
                <Text variant="captionSoft" color="smoke">
                  {view.month}
                </Text>
                <Row gap="xxs" style={styles.spendTop}>
                  <NumText variant="title2Soft">{won(view.spent)}</NumText>
                  <Text variant="calloutBold" color="smoke">
                    원
                  </Text>
                </Row>
              </Row>
              <ProgressBar value={view.ratio} color={over ? 'red' : 'violet'} />
              <Row between>
                <Text variant="micro" color="inkSoft">
                  예산의 {percent(view.spent, budget)}%
                </Text>
                <NumText variant="microBold" color={over ? 'red' : 'violetDeep'}>
                  {over ? `${wonUnit(view.left)} 초과` : `${wonUnit(view.left)} 남음`}
                </NumText>
              </Row>
            </Stack>
          </Card>

          {/*
           * 자동기록은 사용자가 아무것도 안 사도 지출을 남기고 그날 무지출을 깬다.
           * 끊기고 나서 알면 앱이 거짓말한 것처럼 보이므로 미리 말한다.
           */}
          {view.charge ? (
            <Row gap="md" center style={styles.charge}>
              <View style={[styles.chargeDot, { backgroundColor: c.peach }]} />
              <Text variant="micro" color="inkSoft" numberOfLines={1}>
                {chargeLabel(view.charge)} · {view.charge.recurring.name}{' '}
                {wonUnit(view.charge.recurring.amount)} 자동기록
              </Text>
            </Row>
          ) : null}
        </Stack>

        <Stack gap="xl">
          <Row between center>
            <Text variant="subheadBold">최근 기록</Text>
            <Pressable onPress={() => router.push('/history')} hitSlop={10}>
              <Row gap="xxs" center>
                <Text variant="captionSoft" color="smoke">
                  전체
                </Text>
                <IconChevronRight size={14} color={c.smoke} />
              </Row>
            </Pressable>
          </Row>

          {view.recent.length === 0 ? (
            <Card>
              <Text variant="captionMutedLead" color="smoke">
                아직 기록이 없어요. 아래 ＋로 3초 만에 남겨보세요.
              </Text>
            </Card>
          ) : (
            <Card list>
              {view.recent.map((t, i) => {
                const cat = findCategory(categories, t.categoryId);

                return (
                  <Pressable
                    key={t.id}
                    onPress={() => router.push(`/transaction/${t.id}`)}
                    style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                  >
                    <Row gap="xl" py="xl" divider={i > 0}>
                      <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />
                      <Stack gap="xxs" style={styles.mid}>
                        <Text variant="body" numberOfLines={1}>
                          {txnTitle(t, cat.label)}
                        </Text>
                        <Text variant="microSoft" color="smoke" numberOfLines={1}>
                          {txnMeta(t, cat.label, view.methodName.get(t.paymentMethodId ?? ''))}
                        </Text>
                      </Stack>
                      <NumText variant="subheadBold" color={t.type === 'income' ? 'mintText' : 'ink'}>
                        {signedWon(t.type === 'expense' ? -t.amount : t.amount)}
                      </NumText>
                    </Row>
                  </Pressable>
                );
              })}
            </Card>
          )}
        </Stack>
      </ScrollView>

      <ConfirmDialog
        visible={warnBudget}
        icon={<IconWarning size={24} color={c.violet} />}
        iconTone="violetSoft"
        tone="primary"
        title="예산을 초과했어요"
        message={`${view.month} 예산을 넘겼어요\n무지출로 다시 균형을 맞춰볼까요?`}
        cancelLabel="닫기"
        confirmLabel="무지출 도전"
        onCancel={() => alertBudget(view.ym)}
        onConfirm={() => {
          alertBudget(view.ym);
          router.push('/mission');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding, gap: space['5xl'] },
  bell: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spendTop: { alignItems: 'flex-end' },
  charge: { paddingHorizontal: space.xs },
  chargeDot: { width: 5, height: 5, borderRadius: radius.pill },
  mid: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
});
