import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenPadding, space, useColors } from '../theme';
import { IconChevronLeft } from './icons';
import { Row } from './layout';
import { Text } from './Text';

/**
 * 화면 제목 줄. 네이티브 내비게이션 바를 쓰지 않는 이유는 두 가지다.
 *  - 펜슬 시안에 내비 바가 없다. 상태바 다음이 바로 콘텐츠다.
 *  - iOS 26은 back 버튼을 큼직한 유리 캡슐로 그려서 시안과 완전히 다른 크롬이 얹힌다.
 */
export function ScreenHeader({
  title,
  right,
  onBack,
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Row between center style={[styles.bar, { paddingTop: insets.top + space.xs }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로"
        hitSlop={12}
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        style={styles.back}
      >
        <IconChevronLeft size={22} color={c.ink} strokeWidth={2.1} />
      </Pressable>

      <Text variant="headlineStrong" numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.right}>{right}</View>
    </Row>
  );
}

const SIDE = 30;

const styles = StyleSheet.create({
  bar: { paddingHorizontal: screenPadding, paddingBottom: space.lg },
  back: { width: SIDE, marginLeft: -space.sm },
  title: { flex: 1, textAlign: 'center' },
  right: { minWidth: SIDE, alignItems: 'flex-end' },
});
