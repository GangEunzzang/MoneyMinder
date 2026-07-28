import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { monthlyTotal } from '@/entities/recurring/model';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { useRecurring } from '@/entities/recurring/store';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak } from '@/features/mission';
import { won, wonUnit } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { IconChevronRight, ListRow, Row, SectionHeader, Stack, Text, ToggleRow } from '@/shared/ui';

export default function SettingsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const budget = useLedger((s) => s.budget);
  const methods = usePaymentMethods((s) => s.methods);
  const recurring = useRecurring((s) => s.items);
  const [remind, setRemind] = useState(true);

  const streak = useMemo(() => currentStreak(transactions, new Date()), [transactions]);

  const chevron = <IconChevronRight size={16} color={c.mist} />;

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
        전체
      </Text>

      <Row gap="xl" center style={[styles.profile, { backgroundColor: c.surface }]}>
        <Stack center style={[styles.avatar, { backgroundColor: c.violet }]}>
          <Text variant="title3" color="onColor">
            강
          </Text>
        </Stack>
        <Stack gap="xxs" style={styles.mid}>
          <Text variant="bodyBold">은짱</Text>
          <Text variant="micro" color="smoke">
            연속 무지출 {streak}일째
          </Text>
        </Stack>
        {chevron}
      </Row>

      <SectionHeader title="돈 관리" />
      <ListRow title="월 예산" value={wonUnit(budget)} trailing={chevron} />
      <ListRow
        title="결제수단"
        value={`${methods.length}개`}
        trailing={chevron}
        divider
        onPress={() => router.push('/payment-methods')}
      />
      <ListRow
        title="고정 지출"
        subtitle={recurring.length > 0 ? `매월 ${won(monthlyTotal(recurring))}원` : undefined}
        value={`${recurring.length}건`}
        trailing={chevron}
        divider
        onPress={() => router.push('/recurring')}
      />
      <ListRow
        title="월 결산"
        subtitle="이번 달 지출을 한 장으로"
        trailing={chevron}
        divider
        onPress={() => router.push('/monthly')}
      />

      <SectionHeader title="미션" />
      <ListRow
        title="미션 고르기"
        subtitle="무지출 외에 다른 목표도 함께"
        trailing={chevron}
        onPress={() => router.push('/missions')}
      />
      <ListRow title="카테고리 관리" trailing={chevron} divider />

      <SectionHeader title="알림" />
      <ToggleRow
        label="무지출 리마인더"
        hint="저녁에 오늘 지출을 확인시켜 드려요"
        on={remind}
        onChange={setRemind}
      />

      <SectionHeader title="앱" />
      <ListRow title="다크 모드" value="시스템" trailing={chevron} />
      <ListRow title="데이터 내보내기" subtitle="CSV로 저장" trailing={chevron} divider />

      <ListRow title="로그아웃" dimmed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding },
  title: { paddingBottom: space['3xl'] },
  profile: { padding: space['2xl'], borderRadius: radius.card },
  avatar: { width: 44, height: 44, borderRadius: radius.xl },
  mid: { flex: 1, minWidth: 0 },
});
