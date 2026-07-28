import { Pressable, StyleSheet, View } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Row, Stack } from './layout';
import { Text } from './Text';

export function Toggle({ on, onChange }: { on: boolean; onChange?: (next: boolean) => void }) {
  const c = useColors();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      onPress={() => onChange?.(!on)}
      style={[styles.track, { backgroundColor: on ? c.violet : c.hairStrong }]}
    >
      <View style={[styles.knob, { backgroundColor: c.onColor }, on ? styles.knobOn : styles.knobOff]} />
    </Pressable>
  );
}

/**
 * 라벨 + 설명 + 스위치. 설정·고정지출·미션이 전부 같은 형태를 쓴다.
 * 설명은 스위치를 켰을 때 무슨 일이 일어나는지를 쓴다 — 기능 이름을 반복하지 않는다.
 */
export function ToggleRow({
  label,
  hint,
  on,
  onChange,
  divider,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange?: (next: boolean) => void;
  divider?: boolean;
}) {
  return (
    <Row gap="xl" py="xl" divider={divider}>
      <Stack gap="xxs" style={styles.mid}>
        <Text variant="body">{label}</Text>
        {hint ? (
          <Text variant="micro" color="mist">
            {hint}
          </Text>
        ) : null}
      </Stack>
      <Toggle on={on} onChange={onChange} />
    </Row>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 26, borderRadius: radius.pill, justifyContent: 'center' },
  knob: { position: 'absolute', width: 20, height: 20, borderRadius: radius.pill },
  knobOn: { right: space.xxs },
  knobOff: { left: space.xxs },
  mid: { flex: 1, minWidth: 0 },
});
