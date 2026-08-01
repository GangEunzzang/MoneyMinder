import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { useMissions } from '@/entities/mission/store';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  Card,
  Chip,
  ConfirmDialog,
  IconWarning,
  Row,
  ScreenHeader,
  SectionHeader,
  SettingRow,
  Stack,
  Text,
  Toggle,
} from '@/shared/ui';

const GOAL_CHOICES = [2, 3, 4, 5, 6, 7];
/** 리마인더는 저녁에만 의미가 있다. 오전에 "오늘 썼나요"는 물어볼 게 없다. */
const HOUR_CHOICES = [18, 19, 20, 21, 22];

function hourLabel(h: number): string {
  return h < 12 ? `오전 ${h}:00` : `오후 ${h === 12 ? 12 : h - 12}:00`;
}

export default function MissionSettings() {
  const c = useColors();
  const weeklyGoal = useMissions((s) => s.weeklyGoal);
  const remind = useMissions((s) => s.remind);
  const remindHour = useMissions((s) => s.remindHour);
  const configure = useMissions((s) => s.configure);
  const resetStreak = useMissions((s) => s.resetStreak);

  const [picking, setPicking] = useState<'goal' | 'hour' | null>(null);
  const [resetting, setResetting] = useState(false);

  return (
    <>
      <ScreenHeader title="미션 설정" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="미션 목표" first />
        <Card list>
          <SettingRow
            label="주 목표일"
            value={`주 ${weeklyGoal}일`}
            onPress={() => setPicking('goal')}
          />
          <SettingRow label="무지출 기준" value="하루 지출 0원" divider dimmed />
        </Card>

        <SectionHeader title="알림" />
        <Card list>
          <SettingRow
            label="무지출 리마인더"
            trailing={<Toggle on={remind} onChange={(on) => configure({ remind: on })} />}
          />
          <SettingRow
            label="리마인더 시간"
            value={hourLabel(remindHour)}
            divider
            onPress={remind ? () => setPicking('hour') : undefined}
            dimmed={!remind}
          />
        </Card>

        <SectionHeader title="관리" />
        <Card list>
          <SettingRow label="스트릭 기록 초기화" dimmed onPress={() => setResetting(true)} />
        </Card>

        <Text variant="captionMutedLead" color="smoke" style={styles.note}>
          무지출 판정은 그날 지출 합계가 0원인지로만 봅니다. 수입만 있는 날도 무지출이에요 —
          아낀 것과 번 것은 다른 축이니까요.
        </Text>
      </ScrollView>

      <Modal
        visible={picking != null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicking(null)}
      >
        <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={() => setPicking(null)}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={() => {}}>
            <Stack gap="4xl">
              <Text variant="headlineStrong">
                {picking === 'goal' ? '일주일에 며칠 도전할까요?' : '언제 알려드릴까요?'}
              </Text>
              <Row gap="md" style={styles.wrap}>
                {(picking === 'goal' ? GOAL_CHOICES : HOUR_CHOICES).map((v) => (
                  <Chip
                    key={v}
                    label={picking === 'goal' ? `주 ${v}일` : hourLabel(v)}
                    selected={picking === 'goal' ? v === weeklyGoal : v === remindHour}
                    onPress={() =>
                      configure(picking === 'goal' ? { weeklyGoal: v } : { remindHour: v })
                    }
                  />
                ))}
              </Row>
              <Button label="확인" onPress={() => setPicking(null)} />
            </Stack>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={resetting}
        icon={<IconWarning size={24} color={c.red} />}
        title="스트릭 기록을 지울까요?"
        message={'축하 기록만 지워집니다.\n거래 내역과 무지출 판정은 그대로예요'}
        confirmLabel="초기화"
        onCancel={() => setResetting(false)}
        onConfirm={() => {
          resetStreak();
          setResetting(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  note: { paddingTop: space['5xl'] },
  wrap: { flexWrap: 'wrap', rowGap: space.md },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    paddingHorizontal: space['4xl'],
    paddingTop: space['5xl'],
    paddingBottom: space['6xl'],
    borderTopLeftRadius: radius['4xl'],
    borderTopRightRadius: radius['4xl'],
  },
});
