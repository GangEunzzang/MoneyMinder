import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findMission, targetLabel } from '@/entities/mission/model';
import { useMissions } from '@/entities/mission/store';
import { useLedger } from '@/entities/transaction/store';
import { completion } from '@/features/mission';
import { withParticle, won } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import { Button, IconPartyPopper, IconShare, Row, Spring, Stack, Text } from '@/shared/ui';

/** 닫힌 회차를 부르는 말. 진행 중인 회차를 부르는 PERIOD_LABEL 과 시제가 다르다. */
const PAST_LABEL = { week: '지난주', month: '지난달', forever: '지금까지' } as const;
const STREAK_UNIT = { week: '주', month: '달', forever: '번' } as const;
const AGAIN_LABEL = { week: '다음 주도 이어서 하기', month: '다음 달도 이어서 하기', forever: '이어서 하기' } as const;

export default function MissionComplete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const spec = findMission(id);
  const active = useMissions((s) => s.active.find((m) => m.id === id));
  const celebrate = useMissions((s) => s.celebrate);
  const transactions = useLedger((s) => s.transactions);

  const result = useMemo(
    () => (spec && active ? completion(spec, active, transactions, new Date()) : null),
    [spec, active, transactions],
  );

  // 화면을 연 순간 이 회차는 축하가 끝난 것으로 본다. 남기지 않으면 미션을 열 때마다 다시 뜬다.
  useEffect(() => {
    if (spec && result) celebrate(spec.id, result.periodKey);
  }, [spec, result, celebrate]);

  if (!spec || !active || !result) {
    return (
      <Stack center style={styles.gone}>
        <Text variant="body" color="smoke">
          아직 마무리된 회차가 없어요
        </Text>
      </Stack>
    );
  }

  const past = PAST_LABEL[active.period];
  const unit = spec.unitLabel;
  const spared = result.target - result.done;
  const reduced = result.previousDone != null ? result.previousDone - result.done : 0;

  const stats: [string, string][] = [
    ...(result.saved != null ? ([['아낀 돈', `${won(result.saved)}원`]] as [string, string][]) : []),
    ['연속 완주', `${result.streak}${STREAK_UNIT[active.period]}`],
    ['다음 목표', targetLabel(spec, result.nextTarget)],
  ];

  return (
    <View style={[styles.screen, { backgroundColor: c[spec.tint], paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <Stack center style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: c.onColorSoft }]}>
          <IconPartyPopper size={44} color={c.onColor} />
        </View>

        <Text variant="overline" color="onColorMid" style={styles.kicker}>
          미션 완주
        </Text>
        <Text variant="title2Soft" color="onColor" style={styles.title}>
          {spec.title} 성공!
        </Text>
        <Text variant="bodyLead" color="onColorHigh" style={styles.desc}>
          {`${past} ${targetLabel(spec, result.target)} 목표에 ${withParticle(`${result.done}${unit}`, '으로', '로')} 마쳤어요\n`}
          {reduced > 0
            ? `${past}보다 ${reduced}${unit} 줄였네요`
            : `목표까지 ${spared}${unit} 여유가 있었어요`}
        </Text>

        <Row style={[styles.stats, { backgroundColor: c.onColorSoft }]}>
          {stats.map(([label, value]) => (
            <Stack key={label} gap="sm" center style={styles.stat}>
              <Text variant="nano" color="onColorLow">
                {label}
              </Text>
              <Text variant="subheadFlat" color="onColor">
                {value}
              </Text>
            </Stack>
          ))}
        </Row>
      </Stack>

      <Spring />

      <Stack gap="lg" style={[styles.actions, { paddingBottom: insets.bottom + space['6xl'] }]}>
        <Button
          label="자랑하기"
          size="sm"
          icon={<IconShare size={16} color={c[spec.tint]} />}
          labelColor={spec.tint}
          style={[styles.action, { backgroundColor: c.onColor }]}
          onPress={() => router.push('/share')}
        />
        <Button
          label={AGAIN_LABEL[active.period]}
          size="sm"
          labelColor="onColor"
          style={[styles.action, { backgroundColor: c.onColorSoft }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/mission'))}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { paddingTop: space['6xl'], paddingHorizontal: screenPadding },
  badge: { width: 96, height: 96, borderRadius: radius['6xl'], alignItems: 'center', justifyContent: 'center' },
  kicker: { paddingTop: space['6xl'] },
  title: { paddingTop: space.lg, textAlign: 'center' },
  desc: { paddingTop: space.xl, textAlign: 'center', maxWidth: 270 },
  stats: { marginTop: space['6xl'], alignSelf: 'stretch', paddingVertical: space['3xl'], paddingHorizontal: space['4xl'], borderRadius: radius['2xl'] },
  stat: { flex: 1 },
  actions: { paddingHorizontal: screenPadding },
  action: { height: 50 },
  gone: { flex: 1 },
});
