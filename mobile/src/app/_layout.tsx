import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';

import { useAppState } from '@/entities/app/store';
import { fontAssets, palette } from '@/shared/theme';

/** 네비게이션 크롬도 앱과 같은 팔레트를 쓴다. 헤더만 회색이면 화면이 두 겹으로 보인다. */
function navTheme(dark: boolean) {
  const c = dark ? palette.dark : palette.light;
  const base = dark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: { ...base.colors, primary: c.violet, background: c.bg, card: c.bg, text: c.ink, border: c.hair },
  };
}

export default function RootLayout() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? palette.dark : palette.light;
  const [fontsLoaded] = useFonts(fontAssets);
  const onboarded = useAppState((s) => s.onboarded);
  const hydrated = useAppState((s) => s.hydrated);

  // 폰트 없이 먼저 그리면 시스템 폰트로 한 프레임 찍혔다가 바뀌어 글자가 튄다.
  // 복원 전에 라우팅하면 온보딩을 끝낸 사람에게 온보딩이 한 번 더 스친다.
  if (!fontsLoaded || !hydrated) return <View style={{ flex: 1, backgroundColor: c.bg }} />;

  return (
    <ThemeProvider value={navTheme(dark)}>
      {/* 헤더는 화면마다 ScreenHeader 로 그린다. 시안에 네이티브 내비 바가 없다. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        {/*
         * 온보딩 전후를 guard 로 가른다. 예전처럼 내비게이터 대신 <Redirect> 를 반환하면
         * 온보딩 화면이 마운트될 자리가 없어 라우터가 무한히 다시 그린다.
         */}
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        {/* 예산 설정은 온보딩의 마지막 단계이자 설정의 "월 예산"이다. 어느 쪽에서도 닿아야 한다. */}
        <Stack.Screen name="budget-setup" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
