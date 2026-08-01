import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet } from 'react-native';

import { useAppState } from '@/entities/app/store';
import { findCategory } from '@/entities/category/model';
import { useCategories } from '@/entities/category/store';
import { usePaymentMethods } from '@/entities/payment-method/store';
import { useLedger } from '@/entities/transaction/store';
import { screenPadding, space, useColors } from '@/shared/theme';
import {
  Card,
  ConfirmDialog,
  IconWarning,
  ScreenHeader,
  SectionHeader,
  SettingRow,
  Text,
} from '@/shared/ui';

/** 엑셀이 쉼표를 열 구분으로 먹으므로 값 안의 쉼표·따옴표는 감싸서 내보낸다. */
function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export default function DataScreen() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);
  const categories = useCategories();
  const methods = usePaymentMethods((s) => s.methods);
  const wipe = useAppState((s) => s.wipe);
  const [leaving, setLeaving] = useState(false);

  const exportCsv = async () => {
    const methodName = new Map(methods.map((m) => [m.id, m.name]));
    const head = ['날짜', '유형', '금액', '카테고리', '결제수단', '결제처', '메모'];
    const rows = transactions.map((t) =>
      [
        t.date,
        t.type === 'expense' ? '지출' : '수입',
        String(t.amount),
        findCategory(categories, t.categoryId).label,
        t.paymentMethodId ? (methodName.get(t.paymentMethodId) ?? '') : '',
        t.merchant,
        t.memo,
      ]
        .map(csvCell)
        .join(','),
    );

    await Share.share({ message: [head.join(','), ...rows].join('\n') });
  };

  return (
    <>
      <ScreenHeader title="데이터 관리" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="내보내기" first />
        <Card list>
          <SettingRow
            label="CSV로 내보내기"
            value={`${transactions.length}건`}
            onPress={transactions.length > 0 ? exportCsv : undefined}
            dimmed={transactions.length === 0}
          />
          <SettingRow label="전체 데이터 백업" value="준비 중" divider dimmed />
        </Card>

        <SectionHeader title="가져오기" />
        <Card list>
          <SettingRow label="백업에서 복원" value="준비 중" dimmed />
        </Card>

        <SectionHeader title="계정" />
        <Card list>
          <SettingRow label="로그아웃" dimmed />
          <SettingRow label="회원 탈퇴" divider danger onPress={() => setLeaving(true)} />
        </Card>

        <Text variant="captionMutedLead" color="smoke" style={styles.note}>
          내보내기는 기기의 공유 시트를 엽니다. 메일·메모 등 원하는 곳으로 보내면 돼요.
        </Text>
      </ScrollView>

      <ConfirmDialog
        visible={leaving}
        icon={<IconWarning size={24} color={c.red} />}
        title="정말 탈퇴하시겠어요?"
        message={'모든 기록과 무지출 스트릭이\n영구 삭제되며 복구할 수 없어요'}
        confirmLabel="탈퇴하기"
        onCancel={() => setLeaving(false)}
        onConfirm={() => {
          wipe();
          setLeaving(false);
          router.replace('/onboarding');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  note: { paddingTop: space['5xl'] },
});
