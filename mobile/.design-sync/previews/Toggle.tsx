import { Row, Toggle } from 'moneyminder-mobile';

/** 켜짐은 violet — 탭바 활성·주간 도트와 같은 색이다. */
export const States = () => (
  <Row gap="xl" center>
    <Toggle on onChange={() => {}} />
    <Toggle on={false} onChange={() => {}} />
  </Row>
);
