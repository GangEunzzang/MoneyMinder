import { AmountText, Card, DetailRow, ProgressBar, Row, Stack, Text } from 'moneyminder-mobile';

/** 회색 배경 위에 올라가는 모든 덩어리. 기본은 사방 16 패딩. */
export const Default = () => (
  <Card>
    <Stack gap="xl">
      <Text variant="captionSoft" color="smoke">7월</Text>
      <AmountText value="510,700" size="title2Soft" />
      <ProgressBar value={0.43} color="violet" />
      <Row between>
        <Text variant="micro" color="inkSoft">예산의 43%</Text>
        <Text variant="microBold" color="violetDeep">689,300원 남음</Text>
      </Row>
    </Stack>
  </Card>
);

/** `list` — 행이 자기 위아래 여백을 가질 때. 카드가 또 여백을 주면 첫 행이 밀린다. */
export const List = () => (
  <Card list>
    <DetailRow label="카테고리" value="카페·간식" />
    <DetailRow label="날짜" value="7월 27일 월요일" divider />
    <DetailRow label="결제수단" value="신한체크" divider />
  </Card>
);
