import { MonthPager, Stack } from 'moneyminder-mobile';

/** 월 이동. 앞으로 갈 수 있는 끝은 항상 이번 달 — 아직 오지 않은 달의 지출은 없다. */
export const Default = () => <MonthPager ym="2026-07" onChange={() => {}} />;

/** 과거 달에서는 "다음"이 살아난다. */
export const Past = () => (
  <Stack gap="xl">
    <MonthPager ym="2026-05" onChange={() => {}} />
    <MonthPager ym="2026-07" onChange={() => {}} />
  </Stack>
);
