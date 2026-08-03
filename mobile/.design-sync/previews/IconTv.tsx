import { IconTv, Row, Stack, Text } from 'moneyminder-mobile';

/** 기본 22. `size` 로 키운다. */
export const Sizes = () => (
  <Stack gap="md" center>
    <Row gap="xl" center>
      <IconTv />
      <IconTv size={28} />
      <IconTv size={36} />
    </Row>
    <Text variant="micro" color="smoke">22 · 28 · 36</Text>
  </Stack>
);

/** `color` 는 hex 를 받는다 (토큰 이름이 아니다). */
export const Colors = () => (
  <Stack gap="md" center>
    <Row gap="xl" center>
      <IconTv size={28} color="#7C5CFF" />
      <IconTv size={28} color="#626C77" />
      <IconTv size={28} color="#E5484D" />
    </Row>
    <Text variant="micro" color="smoke">violet · smoke · red</Text>
  </Stack>
);
