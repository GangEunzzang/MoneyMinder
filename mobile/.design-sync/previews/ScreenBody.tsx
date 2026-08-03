import { Card, ScreenBody, SectionHeader, Stack, Text } from 'moneyminder-mobile';

/** 모든 화면의 바깥 틀. 좌우 여백을 여기 한 곳에서만 정한다 — 화면마다 다시 적지 않는다. */
export const Framed = () => (
  <ScreenBody>
    <Stack gap="xl">
      <SectionHeader title="최근 기록" />
      <Card>
        <Text variant="title3">510,700원</Text>
      </Card>
    </Stack>
  </ScreenBody>
);
