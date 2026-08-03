import { ProgressBar, Stack, Text } from 'moneyminder-mobile';

/** 예산 소진율. value 는 0~1. */
export const Default = () => <ProgressBar value={0.43} color="violet" />;

/** 넘치면 색으로 말한다 — 진행바와 경고 문구가 같은 red 를 쓴다. */
export const States = () => (
  <Stack gap="xl">
    <Stack gap="sm">
      <Text variant="micro" color="smoke">식비 · 예산의 62%</Text>
      <ProgressBar value={0.62} color="violet" />
    </Stack>
    <Stack gap="sm">
      <Text variant="micro" color="red">교육 · 예산 40,000원 중 139%</Text>
      <ProgressBar value={1} color="red" />
    </Stack>
  </Stack>
);

/** 카테고리 랭킹의 얇은 바 — 아이콘 tint 와 같은 색을 쓴다. */
export const Thin = () => (
  <Stack gap="lg">
    <ProgressBar value={0.37} height={6} color="mint" />
    <ProgressBar value={0.12} height={6} color="violet" />
    <ProgressBar value={0.07} height={6} color="peach" />
  </Stack>
);
