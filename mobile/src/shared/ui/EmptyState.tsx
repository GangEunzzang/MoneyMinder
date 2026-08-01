import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, space, useColors } from '../theme';
import { Button } from './Button';
import { IconPlus } from './icons';
import { Stack } from './layout';
import { Text } from './Text';

type Props = {
  icon?: ReactNode;
  title: string;
  /** 왜 비어 있는지가 아니라, 채우면 뭐가 좋은지를 쓴다. */
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  /**
   * 다른 내용 사이에 끼어드는 자리. 화면 전체가 빈 경우보다 작고 조용하며
   * 행동을 재촉하지 않는다 (펜슬 History-Empty vs PaymentMethods-Empty).
   */
  inline?: boolean;
};

export function EmptyState({ icon, title, body, actionLabel, onAction, inline }: Props) {
  const c = useColors();
  const shape = inline ? INLINE : FULL;

  return (
    <Stack center style={styles.wrap}>
      {icon ? (
        <View
          style={[
            styles.icon,
            {
              width: shape.badge,
              height: shape.badge,
              borderRadius: shape.badgeRadius,
              backgroundColor: c.surface2,
            },
          ]}
        >
          {icon}
        </View>
      ) : null}

      <Text variant={inline ? 'label' : 'headline'} style={{ paddingTop: shape.gapTitle }}>
        {title}
      </Text>
      <Text
        variant={inline ? 'calloutSoftLead' : 'captionMutedLead'}
        color="smoke"
        style={[styles.body, { paddingTop: shape.gapBody, maxWidth: shape.bodyWidth }]}
      >
        {body}
      </Text>

      {actionLabel ? (
        <Button
          label={actionLabel}
          icon={<IconPlus size={17} color={c.onColor} />}
          size="sm"
          onPress={onAction}
          style={[styles.cta, { marginTop: shape.gapCta }]}
        />
      ) : null}
    </Stack>
  );
}

const FULL = {
  badge: 72,
  badgeRadius: radius['4xl'],
  gapTitle: 18,
  gapBody: 7,
  gapCta: 22,
  bodyWidth: 250,
};

const INLINE = {
  badge: 64,
  badgeRadius: radius['5xl'],
  gapTitle: 12,
  gapBody: 12,
  gapCta: 12,
  bodyWidth: 260,
};

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', paddingVertical: space['6xl'] },
  icon: { alignItems: 'center', justifyContent: 'center' },
  body: { textAlign: 'center' },
  cta: { paddingHorizontal: space['4xl'] + 2 },
});
