import { Stack, Text } from 'moneyminder-mobile';

/** 세로 배치. */
export const Default = () => (
  <Stack gap="lg">
    <Text variant="subheadBold">이번 달 지출</Text>
    <Text variant="body">510,700원</Text>
    <Text variant="micro" color="smoke">지난달 같은 기간보다 72,550원 덜 쓰는 중</Text>
  </Stack>
);

/** `center` — 가로세로 가운데. 빈 상태·축하 화면에 쓴다. */
export const Centered = () => (
  <Stack gap="md" center>
    <Text variant="subheadBold">아직 기록이 없어요</Text>
    <Text variant="captionMuted" color="smoke">아래 ＋로 3초 만에 남겨보세요</Text>
  </Stack>
);
