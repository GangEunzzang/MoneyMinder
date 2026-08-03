import { Card, SettingRow } from 'moneyminder-mobile';

/** 설정 목록. 라벨이 곧 누르는 대상이라 라벨이 진하고 값이 흐리다. */
export const Menu = () => (
  <Card list>
    <SettingRow label="월 예산" value="1,200,000원" onPress={() => {}} />
    <SettingRow label="카테고리" value="14개" divider onPress={() => {}} />
    <SettingRow label="고정 지출" value="매월 171,000원" divider onPress={() => {}} />
  </Card>
);

/** `dimmed` 는 "못 누름"이다 — 준비 중인 기능. */
export const Dimmed = () => (
  <Card list>
    <SettingRow label="전체 데이터 백업" value="준비 중" dimmed />
    <SettingRow label="백업에서 복원" value="준비 중" divider dimmed />
  </Card>
);

/** `danger` — 되돌릴 수 없는 줄. dimmed 로 흐리게 두면 "못 누름"으로 읽혀 위험하다. */
export const Danger = () => (
  <Card list>
    <SettingRow label="로그아웃" dimmed />
    <SettingRow label="회원 탈퇴" divider danger onPress={() => {}} />
  </Card>
);
