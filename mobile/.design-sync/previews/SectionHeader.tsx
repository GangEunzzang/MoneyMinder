import { SectionHeader, Stack } from 'moneyminder-mobile';

/** 그룹의 이름. 15/700 — 화면마다 다른 급을 쓰지 않는다. */
export const Default = () => <SectionHeader title="최근 기록" />;

/** `meta` — 우측 보조. 개수나 진입 힌트. */
export const WithMeta = () => (
  <Stack>
    <SectionHeader title="카테고리" meta="6개" first />
    <SectionHeader title="최근 기록" meta="전체" />
  </Stack>
);
