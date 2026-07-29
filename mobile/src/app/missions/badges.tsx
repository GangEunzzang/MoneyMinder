import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useMissions } from '@/entities/mission/store';
import { monthKey } from '@/entities/transaction/model';
import { useLedger } from '@/entities/transaction/store';
import { type BadgeState, badgeStates, earnedCount } from '@/features/mission';
import { percent } from '@/shared/lib/format';
import { radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  HeroCard,
  Card,
  IconAward,
  IconFlame,
  IconTrophy,
  NumText,
  ProgressBar,
  Row,
  ScreenHeader,
  Stack,
  Text,
} from '@/shared/ui';

/** 한 줄에 세 개. 네 개면 라벨이 줄바꿈되고 두 개면 허전하다. */
const PER_ROW = 3;

function Glyph({ badge, earned, color }: { badge: BadgeState; earned: boolean; color: string }) {
  if (badge.kind === 'mission') return <IconTrophy size={26} color={color} />;
  if (badge.kind === 'count') return <IconAward size={26} color={color} />;

  return <IconFlame size={26} color={color} />;
}

export default function BadgeCollection() {
  const c = useColors();
  const transactions = useLedger((s) => s.transactions);
  const celebrated = useMissions((s) => s.celebrated);

  const states = useMemo(
    () => badgeStates(transactions, monthKey(new Date()), new Date(), celebrated.length),
    [transactions, celebrated],
  );

  const earned = earnedCount(states);
  const rows: BadgeState[][] = [];
  for (let i = 0; i < states.length; i += PER_ROW) rows.push(states.slice(i, i + PER_ROW));

  return (
    <>
      <ScreenHeader title="배지 컬렉션" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeroCard>
          <Stack gap="xl">
            <Row gap="xxs" style={styles.count}>
              <NumText variant="title2Flat" color="onColor">
                {earned}
              </NumText>
              <Text variant="body" color="onColorHigh">
                / {states.length}개 획득
              </Text>
            </Row>
            <ProgressBar value={earned / states.length} height={7} color="onColor" />
            <Text variant="caption" color="onColorHigh">
              {percent(earned, states.length)}%
            </Text>
          </Stack>
        </HeroCard>

        <Card>
          <Stack gap="6xl">
            {rows.map((row) => (
              <Row key={row[0].id} between>
                {row.map((b) => (
                  <Stack key={b.id} gap="md" center style={styles.cell}>
                    <View
                      style={[
                        styles.disc,
                        { backgroundColor: b.earned ? c.violetSoft : c.surface2 },
                      ]}
                    >
                      <Glyph badge={b} earned={b.earned} color={b.earned ? c.violet : c.mist} />
                    </View>
                    <Text variant="microBold" color={b.earned ? 'ink' : 'mist'}>
                      {b.label}
                    </Text>
                    <Text variant="nanoSoft" color="mist" numberOfLines={1}>
                      {b.earned ? '획득' : `${Math.min(b.progress, b.goal)}/${b.goal}`}
                    </Text>
                  </Stack>
                ))}
                {row.length < PER_ROW
                  ? Array.from({ length: PER_ROW - row.length }, (_, i) => (
                      <View key={`pad-${i}`} style={styles.cell} />
                    ))
                  : null}
              </Row>
            ))}
          </Stack>
        </Card>

        <Text variant="captionMutedLead" color="smoke" style={styles.note}>
          연속 무지출로 받는 배지, 한 달 무지출 일수로 받는 배지, 미션 완주로 받는 배지가
          섞여 있어요. 스트릭이 끊겨도 받을 수 있는 게 남아 있도록.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: space.xl,
    paddingBottom: space['5xl'],
    gap: space['3xl'],
  },

  count: { alignItems: 'baseline' },
  cell: { flex: 1 },
  disc: {
    width: 56,
    height: 56,
    borderRadius: radius['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: { paddingTop: space.md },
});
