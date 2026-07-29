import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { monthlyReport } from '@/features/report';
import { monthLabel, percent, won, wonUnit } from '@/shared/lib/format';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  MonthPager,
  AmountText,
  Card,
  CategoryIcon,
  IconChevronRight,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

/** 랭킹에 몇 개까지 보여줄지. 그 아래는 "기타"로 접히는 게 아니라 그냥 안 보여준다. */
const RANK_LIMIT = 6;

export default function StatsScreen() {
  const c = useColors();
  const categories = useCategories();
  const transactions = useLedger((s) => s.transactions);
  const categoryBudgets = useLedger((s) => s.categoryBudgets);
  const [ym, setYm] = useState(() => monthKey(new Date()));

  const report = useMemo(
    () => monthlyReport(transactions, ym, RANK_LIMIT),
    [transactions, ym],
  );

  const saved = report.saved > 0;

  return (
    <>
      <ScreenHeader
        title={`${monthLabel(new Date(`${ym}-01T00:00:00`))} 리포트`}
        right={
          <Pressable onPress={() => router.push('/stats/trend')} hitSlop={10}>
            <Text variant="calloutBold" color="violet">
              추이
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MonthPager ym={ym} onChange={setYm} />

        <Card>
          <Stack gap="lg">
            <Text variant="micro" color="smoke">
              {monthLabel(new Date(`${ym}-01T00:00:00`))} 지출
            </Text>
            <AmountText value={won(report.expense)} size="title2Soft" />
            {report.prevExpense > 0 ? (
              <Text variant="callout" color={saved ? 'mintText' : 'red'}>
                지난달보다 {wonUnit(report.saved)} {saved ? '덜' : '더'} 썼어요
              </Text>
            ) : (
              <Text variant="callout" color="smoke">
                비교할 지난달 기록이 없어요
              </Text>
            )}
          </Stack>
        </Card>

        <SectionHeader title="카테고리" meta={`${report.categories.length}개`} />

        {report.categories.length === 0 ? (
          <Card>
            <Text variant="captionMutedLead" color="smoke">
              이 달에는 지출 기록이 없어요.
            </Text>
          </Card>
        ) : (
          <Card list>
            {report.categories.map((row, i) => {
              const cat = findCategory(categories, row.categoryId);
              const limit = categoryBudgets[row.categoryId] ?? 0;
              const over = limit > 0 && row.amount > limit;

              return (
                <Row key={row.categoryId} gap="xl" py="xl" divider={i > 0}>
                  <CategoryIcon icon={cat.icon} tint={cat.tint} tintSoft={cat.tintSoft} />
                  <Stack gap="sm" style={styles.mid}>
                    <Row between center>
                      <Text variant="body">{cat.label}</Text>
                      <NumText variant="bodyBold">{won(row.amount)}</NumText>
                    </Row>
                    {/*
                     * 예산을 넣은 카테고리는 총액 비중이 아니라 소진율을 보여준다.
                     * 비중 37%는 잘 쓴 건지 아닌지를 판단할 기준이 못 된다.
                     */}
                    <ProgressBar
                      value={limit > 0 ? row.amount / limit : row.share / 100}
                      height={6}
                      color={over ? 'red' : cat.tint}
                    />
                    <Row between>
                      {limit > 0 ? (
                        <NumText variant="captionSoft" color={over ? 'red' : 'smoke'}>
                          예산 {won(limit)}원 중 {percent(row.amount, limit)}%
                        </NumText>
                      ) : (
                        <Text variant="captionSoft" color="smoke">
                          {row.share}%
                        </Text>
                      )}
                      {row.delta != null ? (
                        <Text variant="microBold" color={row.delta > 0 ? 'red' : row.delta < 0 ? 'mintText' : 'smoke'}>
                          {row.delta > 0 ? '+' : ''}
                          {row.delta}%
                        </Text>
                      ) : null}
                    </Row>
                  </Stack>
                </Row>
              );
            })}
          </Card>
        )}

        <Pressable onPress={() => router.push('/monthly')}>
          <Card>
            <Row between center>
              <Stack gap="xxs">
                <Text variant="bodyBold">월 결산 보기</Text>
                <Text variant="micro" color="smoke">
                  아낀 돈 · 무지출 일수까지 한 장으로
                </Text>
              </Stack>
              <IconChevronRight size={16} color={c.mist} />
            </Row>
          </Card>
        </Pressable>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingBottom: space['5xl'],
    gap: space['3xl'],
  },
  mid: { flex: 1, minWidth: 0 },
});
