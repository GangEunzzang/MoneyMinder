import { Button, Row, Stack } from 'moneyminder-mobile';

/** 주 동작. 면은 violetFill — 브랜드 violet 위 흰 15/700 은 4.35:1 로 AA 미달이다. */
export const Primary = () => <Button label="저장하기" onPress={() => {}} />;

export const Variants = () => (
  <Stack gap="md">
    <Button label="저장하기" onPress={() => {}} />
    <Button label="닫기" variant="secondary" onPress={() => {}} />
    <Button label="삭제" variant="danger" onPress={() => {}} />
  </Stack>
);

/** 조건이 안 찼을 때. 누를 수 없다는 걸 색으로 말한다. */
export const Muted = () => <Button label="저장하기" muted onPress={() => {}} />;

/** 거래 상세 하단 — 두 버튼이 폭을 나눠 갖는다. */
export const Pair = () => (
  <Row gap="lg">
    <Button label="수정" variant="secondary" size="sm" style={{ flex: 1 }} onPress={() => {}} />
    <Button label="삭제" variant="danger" size="sm" style={{ flex: 1 }} onPress={() => {}} />
  </Row>
);
