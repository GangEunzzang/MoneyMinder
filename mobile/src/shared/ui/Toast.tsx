import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, shadow, space, useColors } from '../theme';
import { IconCheck } from './icons';
import { Text } from './Text';

/** 상단 바 바로 아래. 화면 맨 위에 붙이면 노치·시계와 겹쳐 읽히지 않는다. */
const TOP_OFFSET = 52;
/** 콘텐츠보다 좁게 띄워야 카드가 아니라 떠 있는 알림으로 읽힌다. */
const SIDE_INSET = 40;

export function Toast({ message }: { message: string }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [enter] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 220 }).start();
  }, [enter]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      style={[
        styles.wrap,
        shadow.toast,
        {
          top: insets.top + TOP_OFFSET,
          backgroundColor: c.ink,
          opacity: enter,
          transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
        },
      ]}
    >
      <View style={[styles.check, { backgroundColor: c.mint }]}>
        <IconCheck size={14} color={c.onColor} strokeWidth={2.6} />
      </View>
      <Text variant="bodyBold" color="onColor">
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: SIDE_INSET,
    right: SIDE_INSET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingVertical: space.xl,
    paddingHorizontal: space['3xl'],
    borderRadius: radius.pill,
  },
  check: { width: 22, height: 22, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
});
