import { ConfirmDialog, IconPartyPopper, IconTrash } from 'moneyminder-mobile';

/** 되돌릴 수 없는 확인. 문장만 있는 담백한 형태. */
export const Danger = () => (
  <ConfirmDialog
    visible
    title="이 기록을 지울까요?"
    message="지운 기록은 되돌릴 수 없어요."
    confirmLabel="삭제"
    tone="danger"
    onCancel={() => {}}
    onConfirm={() => {}}
  />
);

/** 아이콘을 주면 "무슨 일인지 먼저 보이는" 형태가 된다. 축하는 violet 으로. */
export const Celebrate = () => (
  <ConfirmDialog
    visible
    icon={<IconPartyPopper size={28} color="#7C5CFF" />}
    iconTone="violetSoft"
    title="무지출 12일째!"
    message="이번 달 194,552원을 아꼈어요."
    cancelLabel="닫기"
    confirmLabel="자랑하기"
    onCancel={() => {}}
    onConfirm={() => {}}
  />
);

/** 경고는 redSoft. 같은 형태라도 색이 결과를 미리 말한다. */
export const Warn = () => (
  <ConfirmDialog
    visible
    icon={<IconTrash size={28} color="#E5484D" />}
    iconTone="redSoft"
    title="결제수단을 지울까요?"
    message="이 수단으로 남긴 기록 14건은 '현금'으로 옮겨져요."
    confirmLabel="삭제"
    tone="danger"
    onCancel={() => {}}
    onConfirm={() => {}}
  />
);
