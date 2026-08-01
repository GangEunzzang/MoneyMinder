import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { radius, shadow, space, useColors } from '../theme';
import { Button } from './Button';
import { Row } from './layout';
import { Text } from './Text';

type Props = {
  visible: boolean;
  /**
   * 아이콘을 주면 축하·경고처럼 "무슨 일인지 먼저 보이는" 형태가 되고,
   * 없으면 문장만 있는 담백한 형태가 된다 (펜슬 DeleteConfirm vs PaymentMethod-DeleteConfirm).
   */
  icon?: ReactNode;
  iconTone?: 'redSoft' | 'violetSoft' | 'mintSoft';
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  visible,
  icon,
  iconTone = 'redSoft',
  title,
  message,
  cancelLabel = '취소',
  confirmLabel,
  tone = 'danger',
  onCancel,
  onConfirm,
}: Props) {
  const c = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={[styles.scrim, { backgroundColor: c.scrim }]} onPress={onCancel}>
        {/* 다이얼로그 위를 눌렀을 때 스크림의 닫기가 따라 도는 것을 막는다. */}
        <Pressable
          style={[
            styles.dialog,
            shadow.dialog,
            { backgroundColor: c.surface, gap: icon ? space['2xl'] : space.lg },
          ]}
          onPress={() => {}}
        >
          {icon ? (
            <View style={[styles.badge, { backgroundColor: c[iconTone] }]}>{icon}</View>
          ) : null}

          <Text variant={icon ? 'headlineFlat' : 'headlineStrong'} style={styles.center}>
            {title}
          </Text>
          <Text
            variant={icon ? 'calloutSoftLead' : 'captionMutedLead'}
            color="smoke"
            style={styles.center}
          >
            {message}
          </Text>

          <Row gap="lg" style={[styles.actions, { paddingTop: icon ? space.sm : space.lg }]}>
            <Button
              label={cancelLabel}
              variant="secondary"
              size="sm"
              style={styles.action}
              onPress={onCancel}
            />
            <Button
              label={confirmLabel}
              size="sm"
              style={[styles.action, { backgroundColor: tone === 'danger' ? c.redFill : c.violetFill }]}
              onPress={onConfirm}
            />
          </Row>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space['6xl'],
  },
  dialog: {
    padding: space['5xl'],
    borderRadius: radius['3xl'],
    alignItems: 'center',
  },
  badge: { width: 52, height: 52, borderRadius: radius['4xl'], alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  actions: { alignSelf: 'stretch' },
  action: { flex: 1 },
});
