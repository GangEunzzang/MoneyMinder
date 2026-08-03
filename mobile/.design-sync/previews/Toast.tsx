import { Toast } from 'moneyminder-mobile';

/** 저장·삭제 직후 한 줄. 버튼이 없다 — 읽고 사라지는 것이 전부다. */
export const Saved = () => <Toast message="기록했어요" />;

export const Deleted = () => <Toast message="삭제했어요" />;
