import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Button } from './Button';
import { Stack } from './layout';
import { Text } from './Text';

type Props = {
  icon?: ReactNode;
  title: string;
  /** 왜 비어 있는지가 아니라, 채우면 뭐가 좋은지를 쓴다. */
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, body, actionLabel, onAction }: Props) {
  const c = useColors();

  return (
    <Stack gap="lg" center style={styles.wrap}>
      {icon ? (
        <Stack center style={[styles.icon, { backgroundColor: c.surface2 }]}>
          {icon}
        </Stack>
      ) : null}
      <Text variant="subhead">{title}</Text>
      <Text variant="micro" color="smoke" style={styles.body}>
        {body}
      </Text>
      {actionLabel ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={styles.cta} />
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingVertical: space['6xl'] },
  icon: { width: 64, height: 64, borderRadius: radius['3xl'], marginBottom: space.sm },
  body: { textAlign: 'center', lineHeight: 18, maxWidth: 260 },
  cta: { marginTop: space['3xl'], paddingHorizontal: space['6xl'] },
});
