import { Button, ScreenHeader, Stack } from 'moneyminder-mobile';

/** 화면 제목 줄. 네이티브 내비 바를 안 쓴다 — 펜슬에 내비 바가 없고 iOS 26 back 캡슐이 시안을 깬다. */
export const Titles = () => (
  <Stack gap="4xl">
    <ScreenHeader title="거래 상세" onBack={() => {}} />
    <ScreenHeader title="고정 지출" onBack={() => {}} />
  </Stack>
);

/** `right` 로 화면별 액션 하나를 단다. */
export const WithAction = () => (
  <ScreenHeader
    title="카테고리"
    onBack={() => {}}
    right={<Button label="추가" variant="secondary" onPress={() => {}} />}
  />
);
