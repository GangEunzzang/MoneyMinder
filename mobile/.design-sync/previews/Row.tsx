import { Row, Text } from 'moneyminder-mobile';

/** 가로 배치. gap 은 space 스케일만 받는다. */
export const Gaps = () => (
  <Row gap="xl">
    <Text variant="body">하나</Text>
    <Text variant="body">둘</Text>
    <Text variant="body">셋</Text>
  </Row>
);

/** `between` — 라벨과 값을 양끝으로. 목록 행의 기본형이다. */
export const Between = () => (
  <Row between center>
    <Text variant="body">스타벅스</Text>
    <Text variant="subheadBold">-6,100</Text>
  </Row>
);

/** `divider` — 위쪽 구분선. 목록에서 첫 행만 빼고 준다. */
export const Divided = () => (
  <>
    <Row between center py="xl">
      <Text variant="body">CGV</Text>
      <Text variant="subheadBold">-14,000</Text>
    </Row>
    <Row between center py="xl" divider>
      <Text variant="body">이마트</Text>
      <Text variant="subheadBold">-63,000</Text>
    </Row>
  </>
);
