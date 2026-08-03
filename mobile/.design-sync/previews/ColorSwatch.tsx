import { ColorSwatch, Row } from 'moneyminder-mobile';

/** 카테고리 색 고르기에 쓰는 점. 토큰 이름을 그대로 받는다. */
export const Palette = () => (
  <Row gap="md" center>
    {(['violet', 'violetDeep', 'mint', 'peach', 'red', 'smoke'] as const).map((c) => (
      <ColorSwatch key={c} color={c} />
    ))}
  </Row>
);
