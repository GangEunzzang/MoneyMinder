import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type ColorName, radius, screenPadding, space, useColors } from '@/shared/theme';
import {
  Button,
  IconCheck,
  IconFlame,
  type IconProps,
  IconRepeat,
  Row,
  Spring,
  Stack,
  Text,
} from '@/shared/ui';

type Slide = {
  title: string;
  body: string;
  Icon: (p: IconProps) => React.ReactElement;
  tint: ColorName;
  tintSoft: ColorName;
};

const SLIDES: Slide[] = [
  {
    title: '3초면 기록 끝',
    body: '결제처·카테고리 자동 추천으로\n지출 기록이 순식간에 끝나요',
    Icon: IconCheck,
    tint: 'violet',
    tintSoft: 'violetSoft',
  },
  {
    title: '안 쓴 날도 미션이 돼요',
    body: '무지출에 성공하면 스트릭이 쌓이고\n배지를 모을 수 있어요',
    Icon: IconFlame,
    tint: 'peach',
    tintSoft: 'peachSoft',
  },
  {
    title: '고정 지출은 알아서',
    body: '넷플릭스·통신비처럼 매월 나가는 돈은\n결제일에 알아서 기록돼요',
    Icon: IconRepeat,
    tint: 'mint',
    tintSoft: 'mintSoft',
  },
];

export default function Onboarding() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const next = () => (last ? router.replace('/login') : setIndex(index + 1));

  return (
    <View style={[styles.screen, { backgroundColor: c.surface, paddingTop: insets.top }]}>
      <Row style={styles.skipRow}>
        <Spring />
        <Pressable onPress={() => router.replace('/login')} hitSlop={12}>
          <Text variant="callout" color="smoke">
            건너뛰기
          </Text>
        </Pressable>
      </Row>

      <Stack gap="6xl" center style={styles.body}>
        <Stack center style={[styles.art, { backgroundColor: c[slide.tintSoft] }]}>
          <slide.Icon size={56} color={c[slide.tint]} strokeWidth={1.8} />
        </Stack>
        <Stack gap="xl" center>
          <Text variant="title2Soft">{slide.title}</Text>
          <Text variant="bodySoftLead" color="smoke" style={styles.copy}>
            {slide.body}
          </Text>
        </Stack>
      </Stack>

      <Stack gap="6xl" style={[styles.footer, { paddingBottom: insets.bottom + space['4xl'] }]}>
        <Row gap="sm" center>
          {SLIDES.map((s, i) => (
            <View
              key={s.title}
              style={[
                styles.dot,
                i === index
                  ? { width: 20, backgroundColor: c.violet }
                  : { backgroundColor: c.hairStrong },
              ]}
            />
          ))}
        </Row>
        <Button label={last ? '시작하기' : '다음'} onPress={next} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  skipRow: { paddingHorizontal: screenPadding, paddingTop: space.md },
  body: { flex: 1, paddingHorizontal: screenPadding },
  art: { width: 128, height: 128, borderRadius: radius['5xl'] },
  copy: { textAlign: 'center' },
  footer: { paddingHorizontal: screenPadding },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
});
