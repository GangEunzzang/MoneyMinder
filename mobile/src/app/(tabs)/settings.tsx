import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePaymentMethods } from '@/entities/payment-method/store';
import { isCard } from '@/entities/payment-method/model';
import { monthlyTotal } from '@/entities/recurring/model';
import { useRecurring } from '@/entities/recurring/store';
import { useLedger } from '@/entities/transaction/store';
import { currentStreak } from '@/features/mission';
import { won, wonUnit } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Card,
  IconChevronRight,
  Row,
  SettingRow,
  Stack,
  Text,
  Toggle,
} from '@/shared/ui';

const TAB_CLEARANCE = 96;
const WEEKLY_GOAL = 4;

export default function SettingsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const transactions = useLedger((s) => s.transactions);
  const budget = useLedger((s) => s.budget);
  const methods = usePaymentMethods((s) => s.methods);
  const recurring = useRecurring((s) => s.items);
  const [remind, setRemind] = useState(true);

  const streak = useMemo(() => currentStreak(transactions, new Date()), [transactions]);
  const cards = methods.filter(isCard).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + TAB_CLEARANCE },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title3">전체</Text>

      <Card style={styles.profile}>
        <Row gap="xl" center>
          <View style={[styles.avatar, { backgroundColor: c.violet }]}>
            <Text variant="headlineFlat" color="onColor">
              강
            </Text>
          </View>
          <Stack gap="xxs" style={styles.mid}>
            <Text variant="label">은짱</Text>
            <Text variant="captionMuted" color="smoke" numberOfLines={1}>
              연속 무지출 {streak}일째 · 프로필 관리
            </Text>
          </Stack>
          <IconChevronRight size={18} color={c.mist} />
        </Row>
      </Card>

      <Card list>
        <SettingRow label="월 예산" value={wonUnit(budget)} onPress={() => router.push('/budget-setup')} />
        <SettingRow
          label="무지출 미션 목표"
          value={`주 ${WEEKLY_GOAL}일`}
          divider
          onPress={() => router.push('/missions')}
        />
        {/* 카테고리 관리 화면(SNGHU)이 아직 없다. 엉뚱한 데로 보내느니 갈 곳이 없음을 보여준다. */}
        <SettingRow label="카테고리 관리" value="준비 중" divider dimmed />
        <SettingRow
          label="결제수단 관리"
          value={`카드 ${cards} · 현금 계좌 ${methods.length - cards}`}
          divider
          onPress={() => router.push('/payment-methods')}
        />
        <SettingRow
          label="고정 지출"
          value={recurring.length > 0 ? `매월 ${won(monthlyTotal(recurring))}원` : '없음'}
          divider
          onPress={() => router.push('/recurring')}
        />
        <SettingRow label="월 결산" divider onPress={() => router.push('/monthly')} />
      </Card>

      <Card list>
        <SettingRow
          label="무지출 리마인더"
          trailing={<Toggle on={remind} onChange={setRemind} />}
        />
        <SettingRow label="다크 모드" value="시스템" divider dimmed />
        <SettingRow label="홈 위젯 · 빠른 기록" value="준비 중" divider dimmed />
      </Card>

      <Card list>
        <SettingRow label="데이터 내보내기 (CSV)" value="준비 중" dimmed />
        <SettingRow label="로그아웃" dimmed divider />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: screenPadding, gap: space['2xl'] },
  profile: { padding: space['2xl'] },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1, minWidth: 0 },
});
