import { ErrorState } from 'moneyminder-mobile';

/** 실패 화면. 무엇이 잘못됐는지와 **무엇을 하면 되는지**를 같이 말한다. */
export const Default = () => <ErrorState onRetry={() => {}} />;

export const Custom = () => (
  <ErrorState
    title="기록을 저장하지 못했어요"
    body={'잠시 후 다시 시도해주세요\n입력한 내용은 남아 있어요'}
    actionLabel="다시 저장"
    onRetry={() => {}}
  />
);
