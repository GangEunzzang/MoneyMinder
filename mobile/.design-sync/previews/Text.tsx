import { Stack, Text } from 'moneyminder-mobile';

/** 타입 스케일. 자유 fontSize 는 ESLint 가 막는다 — variant 로만 쓴다. */
export const Scale = () => (
  <Stack gap="md">
    <Text variant="title3">내역</Text>
    <Text variant="subheadBold">최근 기록</Text>
    <Text variant="body">스타벅스</Text>
    <Text variant="callout">카페·간식</Text>
    <Text variant="microSoft" color="smoke">카페·간식 · 신한체크</Text>
  </Stack>
);

/** 색도 토큰만. smoke 는 5.34:1 로 AA 를 넘긴다. */
export const Colors = () => (
  <Stack gap="sm">
    <Text variant="body">ink — 본문</Text>
    <Text variant="body" color="smoke">smoke — 보조</Text>
    <Text variant="body" color="mintText">mintText — 수입·절약</Text>
    <Text variant="body" color="red">red — 초과·삭제</Text>
  </Stack>
);
