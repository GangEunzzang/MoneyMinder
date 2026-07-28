import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { palette, type } from '@/shared/theme';

/** 네비게이션 크롬도 앱과 같은 팔레트를 쓴다. 헤더만 회색이면 화면이 두 겹으로 보인다. */
function navTheme(dark: boolean) {
  const c = dark ? palette.dark : palette.light;
  const base = dark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.violet,
      background: c.bg,
      card: c.bg,
      text: c.ink,
      border: c.hair,
    },
  };
}

export default function RootLayout() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? palette.dark : palette.light;

  return (
    <ThemeProvider value={navTheme(dark)}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: type.headline,
          headerTintColor: c.ink,
          headerStyle: { backgroundColor: c.bg },
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* 기록 화면은 자체 상단 바(닫기 + 지출/수입)를 갖는다. */}
        <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
