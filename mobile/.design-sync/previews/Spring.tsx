import { Button, Card, Row, Spring, Stack, Text } from 'moneyminder-mobile';

/** 남는 세로 공간을 먹는 빈 칸. 카드가 짧아도 버튼이 바닥에 붙는다. */
export const PushesToBottom = () => (
  <Stack gap="xl" style={{ height: 320 }}>
    <Card>
      <Text variant="title3">6,100원</Text>
    </Card>
    <Spring />
    <Row gap="md">
      <Button label="수정" variant="secondary" onPress={() => {}} />
      <Button label="삭제" variant="danger" onPress={() => {}} />
    </Row>
  </Stack>
);
