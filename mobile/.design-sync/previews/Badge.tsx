import { Badge, Row } from 'moneyminder-mobile';

/** 연속 무지출 배지. `streak` 가 `days` 를 넘으면 획득 상태(violet)로 켜진다. */
export const Collection = () => (
  <Row gap="xl" center>
    {[1, 3, 7, 14, 30, 100].map((d) => (
      <Badge key={d} days={d} streak={12} />
    ))}
  </Row>
);

/** 하나도 못 받은 상태 — 전부 mist. 회색이 "아직"을 말한다. */
export const None = () => (
  <Row gap="xl" center>
    {[1, 3, 7, 14].map((d) => (
      <Badge key={d} days={d} streak={0} />
    ))}
  </Row>
);
