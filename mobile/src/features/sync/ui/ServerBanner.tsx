import { StyleSheet, View } from 'react-native';

import { useSession } from '@/entities/session/store';
import { radius, space, useColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

const LABEL = {
  idle: '서버 확인 전',
  connecting: '서버에 연결하는 중',
  connected: '서버 연결됨',
  offline: '서버 없이 로컬 데이터로 동작 중',
} as const;

/**
 * 서버가 붙었는지 눈으로 보이게 한다. 로컬 저장으로도 화면이 그려지므로
 * 이 표시가 없으면 데이터가 어디서 왔는지 알 수 없다.
 */
export function ServerBanner() {
  const c = useColors();
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);

  const tone =
    status === 'connected' ? c.mintSoft : status === 'offline' ? c.redSoft : c.surface2;
  const dot = status === 'connected' ? c.mint : status === 'offline' ? c.red : c.smoke;

  return (
    <View style={[styles.wrap, { backgroundColor: tone }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text variant="caption" color="ink">
        {LABEL[status]}
        {status === 'offline' && error ? ` · ${error}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
  },
  dot: { width: 6, height: 6, borderRadius: radius.pill },
});
