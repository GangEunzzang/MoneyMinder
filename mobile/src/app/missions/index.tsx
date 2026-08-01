import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { findMission, MISSIONS, targetLabel } from '@/entities/mission/model';
import { useMissions } from '@/entities/mission/store';
import { useLedger } from '@/entities/transaction/store';
import { missionProgress, remainingLabel } from '@/features/mission';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  IconChevronRight,
  IconTarget,
  ListRow,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  SectionHeader,
  Stack,
  Text,
} from '@/shared/ui';

export default function MissionPicker() {
  const c = useColors();
  const active = useMissions((s) => s.active);
  const transactions = useLedger((s) => s.transactions);

  const view = useMemo(() => {
    const today = new Date();
    const running = active
      .map((m) => {
        const spec = findMission(m.id);

        return spec ? { spec, active: m, progress: missionProgress(spec, m, transactions, today) } : null;
      })
      .filter((x) => x != null);

    return {
      running,
      available: MISSIONS.filter((spec) => !active.some((m) => m.id === spec.id)),
    };
  }, [active, transactions]);

  return (
    <>
      <ScreenHeader title={'미션 고르기'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="진행 중" meta={`${view.running.length}개`} accent first />
        {view.running.length === 0 ? (
          <Text variant="micro" color="mist" style={styles.none}>
            진행 중인 미션이 없어요. 아래에서 하나 골라보세요.
          </Text>
        ) : (
          view.running.map(({ spec, active: m, progress }) => (
            <Stack
              key={spec.id}
              gap="lg"
              style={[styles.card, { backgroundColor: c[spec.tintSoft] }]}
              onTouchEnd={() => router.push(`/missions/${spec.id}`)}
            >
              <Row between center>
                <Text variant="bodyBold">{spec.title}</Text>
                <NumText variant="calloutStrong" color={spec.tint}>
                  {progress.done}/{progress.target}
                  {spec.unit === 'won' ? '' : spec.unitLabel}
                </NumText>
              </Row>
              <ProgressBar value={progress.ratio} height={6} color={spec.tint} />
              <Row between center>
                <Text variant="micro" color="mist">
                  {targetLabel(spec, m.target)} 목표 · {remainingLabel(spec, progress)}
                </Text>
                <IconChevronRight size={14} color={c.mist} />
              </Row>
            </Stack>
          ))
        )}

        <SectionHeader title="더 고를 수 있어요" meta={`${view.available.length}개`} />
        {view.available.map((spec, i) => (
          <ListRow
            key={spec.id}
            leading={
              <Stack center style={[styles.icon, { backgroundColor: c[spec.tintSoft] }]}>
                <IconTarget size={18} color={c[spec.tint]} />
              </Stack>
            }
            title={spec.title}
            subtitle={spec.summary}
            trailing={<IconChevronRight size={16} color={c.mist} />}
            divider={i > 0}
            onPress={() => router.push(`/missions/setup/${spec.id}`)}
          />
        ))}

        <Stack gap="sm" style={[styles.note, { backgroundColor: c.surface2 }]}>
          <Text variant="micro" color="inkSoft">
            · 미션은 여러 개를 동시에 할 수 있어요
          </Text>
          <Text variant="micro" color="inkSoft">
            · 하나가 끊겨도 나머지 미션은 그대로 이어져요
          </Text>
        </Stack>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: screenPadding, paddingBottom: space['5xl'] },
  card: { padding: space['4xl'], borderRadius: radius.card, marginBottom: space.lg },
  icon: { width: 40, height: 40, borderRadius: radius.lg },
  none: { paddingVertical: space['4xl'] },
  note: { padding: space['2xl'], borderRadius: radius.xl, marginTop: space['5xl'] },
});
