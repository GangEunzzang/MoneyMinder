import { ScrollView, StyleSheet, View } from 'react-native';

import { type NotifyKey, useAppState } from '@/entities/app/store';
import { screenPadding, space } from '@/shared/theme';
import { Card, ScreenHeader, SectionHeader, SettingRow, Text, Toggle } from '@/shared/ui';

const GROUPS: { title: string; rows: { key: NotifyKey; label: string }[] }[] = [
  {
    title: '무지출 미션',
    rows: [
      { key: 'noSpendRemind', label: '무지출 리마인더' },
      { key: 'missionDone', label: '미션 달성 알림' },
      { key: 'badge', label: '배지 획득 알림' },
    ],
  },
  {
    title: '가계부',
    rows: [
      { key: 'budgetOver', label: '예산 초과 경고' },
      { key: 'weekly', label: '주간 리포트' },
      { key: 'bigSpend', label: '큰 지출 알림' },
    ],
  },
  { title: '기타', rows: [{ key: 'marketing', label: '마케팅 정보 수신' }] },
];

export default function NotificationSettings() {
  const notify = useAppState((s) => s.notify);
  const setNotify = useAppState((s) => s.setNotify);

  return (
    <>
      <ScreenHeader title="알림 설정" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {GROUPS.map((group, gi) => (
          <View key={group.title}>
            <SectionHeader title={group.title} first={gi === 0} />
            <Card list>
              {group.rows.map((row, i) => (
                <SettingRow
                  key={row.key}
                  label={row.label}
                  divider={i > 0}
                  trailing={
                    <Toggle on={notify[row.key]} onChange={(on) => setNotify(row.key, on)} />
                  }
                />
              ))}
            </Card>
          </View>
        ))}

        <Text variant="captionMutedLead" color="smoke" style={styles.note}>
          알림은 아직 기기에 실제로 오지 않아요. 여기서 정해둔 값은 푸시를 붙일 때 그대로 씁니다.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  note: { paddingTop: space['5xl'] },
});
