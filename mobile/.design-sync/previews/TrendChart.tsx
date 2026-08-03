import { Card, Stack, Text, TrendChart } from 'moneyminder-mobile';

const points = [
  { ym: '2026-02', expense: 431200 },
  { ym: '2026-03', expense: 512900 },
  { ym: '2026-04', expense: 388400 },
  { ym: '2026-05', expense: 604100 },
  { ym: '2026-06', expense: 583250 },
  { ym: '2026-07', expense: 510700, current: true },
];

/** 월별 지출 막대. 이번 달만 violet 이고 나머지는 회색 — 비교 대상이지 주인공이 아니다. */
export const SixMonths = () => <TrendChart points={points} />;

/** 실제로는 카드 안에서 금액 아래에 붙는다. */
export const InCard = () => (
  <Card>
    <Stack gap="lg">
      <Text variant="callout" color="smoke">월별 지출 추이</Text>
      <TrendChart points={points} />
    </Stack>
  </Card>
);
