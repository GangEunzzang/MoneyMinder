import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type ColorName, radius, screenPadding, space, useColors } from '@/shared/theme';
import { IconWallet, Row, Spring, Stack, Text } from '@/shared/ui';

/** 소셜 로그인 버튼. 브랜드 색은 팔레트의 kakao/apple 토큰을 쓴다. */
function SocialButton({
  label,
  bg,
  fg,
  onPress,
}: {
  label: string;
  bg: ColorName;
  fg: ColorName;
  onPress: () => void;
}) {
  const c = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.social, { backgroundColor: c[bg], opacity: pressed ? 0.85 : 1 }]}
    >
      <Text variant="label" color={fg}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Login() {
  const c = useColors();
  const insets = useSafeAreaInsets();

  // 로컬 우선 앱이라 로그인은 아직 통과만 시킨다. 동기화를 붙일 때 실제 인증이 들어온다.
  const enter = () => router.replace('/budget-setup');

  return (
    <View style={[styles.screen, { backgroundColor: c.surface, paddingTop: insets.top }]}>
      <Spring />
      <Stack gap="xl" center>
        <Stack center style={[styles.mark, { backgroundColor: c.violet }]}>
          <IconWallet size={40} color={c.onColor} strokeWidth={1.8} />
        </Stack>
        <Text variant="title2">머니마인더</Text>
        <Text variant="callout" color="smoke">
          무지출 미션이 있는 가계부
        </Text>
      </Stack>

      <Spring />

      <Stack gap="lg" style={[styles.actions, { paddingBottom: insets.bottom + space['4xl'] }]}>
        <SocialButton label="카카오로 시작하기" bg="kakao" fg="kakaoInk" onPress={enter} />
        <SocialButton label="Apple로 시작하기" bg="apple" fg="onColor" onPress={enter} />
        <Row center style={styles.guest}>
          <Pressable onPress={enter} hitSlop={12}>
            <Text variant="callout" color="smoke">
              로그인 없이 둘러보기
            </Text>
          </Pressable>
        </Row>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  mark: { width: 76, height: 76, borderRadius: radius['4xl'] },
  actions: { paddingHorizontal: screenPadding },
  social: {
    height: 52,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guest: { paddingTop: space.lg },
});
