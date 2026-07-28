import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Button } from './Button';
import { IconWallet, IconWarning } from './icons';
import { Stack } from './layout';
import { Text } from './Text';

/** 로고 + 한 줄. 폰트와 저장소가 준비되기 전에 보이는 유일한 화면이다. */
export function Splash() {
  const c = useColors();

  return (
    <Stack gap="4xl" center style={[styles.fill, { backgroundColor: c.violet }]}>
      <View style={[styles.mark, { backgroundColor: c.onColorSoft }]}>
        <IconWallet size={40} color={c.onColor} strokeWidth={1.8} />
      </View>
      <Stack gap="lg" center>
        <Text variant="title2Soft" color="onColor">
          머니마인더
        </Text>
        <Text variant="calloutSoft" color="onColorHigh">
          가계부는 3초처럼, 무지출은 미션처럼
        </Text>
      </Stack>
    </Stack>
  );
}

export function Loading({ label = '불러오는 중...' }: { label?: string }) {
  const c = useColors();

  return (
    <Stack gap="4xl" center style={styles.fill}>
      <ActivityIndicator color={c.violet} />
      <Text variant="body" color="smoke">
        {label}
      </Text>
    </Stack>
  );
}

export function ErrorState({
  title = '연결에 실패했어요',
  body = '인터넷 연결을 확인하고\n다시 시도해주세요',
  actionLabel = '다시 시도',
  onRetry,
}: {
  title?: string;
  body?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  const c = useColors();

  return (
    <Stack gap="4xl" center style={styles.fill}>
      <View style={[styles.badge, { backgroundColor: c.redSoft }]}>
        <IconWarning size={30} color={c.red} />
      </View>
      <Stack gap="xl" center>
        <Text variant="title3Flat">{title}</Text>
        <Text variant="bodySoftLead" color="smoke" style={styles.center}>
          {body}
        </Text>
      </Stack>
      {onRetry ? <Button label={actionLabel} onPress={onRetry} style={styles.cta} /> : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, padding: space['6xl'] },
  mark: {
    width: 78,
    height: 78,
    borderRadius: radius['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radius['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  cta: { alignSelf: 'stretch', marginTop: space.md },
});
