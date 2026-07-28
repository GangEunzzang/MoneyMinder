import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';

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

  // 폰트 없이 먼저 그리면 시스템 폰트로 한 프레임 찍혔다가 바뀌어 글자가 튄다.
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: c.bg }} />;

  return (
    <ThemeProvider value={navTheme(dark)}>
      {/* 헤더는 화면마다 ScreenHeader 로 그린다. 시안에 네이티브 내비 바가 없다. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
