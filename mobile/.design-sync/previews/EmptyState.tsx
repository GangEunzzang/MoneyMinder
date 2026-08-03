import { EmptyState, IconReceipt } from 'moneyminder-mobile';

/** 화면 전체가 빈 경우. 왜 비었는지가 아니라 **채우면 뭐가 좋은지**를 쓴다. */
export const Full = () => (
  <EmptyState
    icon={<IconReceipt size={30} color="#7C5CFF" />}
    title="아직 기록이 없어요"
    body={'아래 ＋로 3초 만에 남겨보세요\n하루 한 줄이면 한 달이 보여요'}
    actionLabel="첫 기록 남기기"
    onAction={() => {}}
  />
);

/** 다른 내용 사이에 끼는 자리. 작고 조용하며 행동을 재촉하지 않는다. */
export const Inline = () => (
  <EmptyState inline title="이 달엔 기록이 없어요" body="다른 달을 골라보세요" />
);
