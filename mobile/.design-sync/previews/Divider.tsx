import { Card, Divider, Row, Stack, Text } from 'moneyminder-mobile';

/** 카드 안에서 성격이 다른 두 덩어리를 가른다. */
export const InCard = () => (
  <Card>
    <Stack gap="xl">
      <Text variant="title3">510,700원</Text>
      <Divider />
      <Row gap="5xl">
        <Text variant="microBold" color="smoke">수입 +2,600,000</Text>
        <Text variant="microBold" color="smoke">무지출 8일</Text>
      </Row>
    </Stack>
  </Card>
);
