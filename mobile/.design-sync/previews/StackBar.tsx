import { StackBar } from 'moneyminder-mobile';

const labels = new Map([
  ['shinhan', '신한체크'],
  ['kb', '국민카드'],
  ['kakao', '카카오뱅크'],
  ['cash', '현금'],
]);

/** 결제수단별 비중 한 줄. 파이 대신 막대인 이유는 4~5개를 옆으로 읽는 게 빠르기 때문이다. */
export const ByMethod = () => (
  <StackBar
    segments={[
      { id: 'shinhan', ratio: 0.52, color: 'violet' },
      { id: 'kb', ratio: 0.27, color: 'peach' },
      { id: 'kakao', ratio: 0.14, color: 'mint' },
      { id: 'cash', ratio: 0.07, color: 'smoke' },
    ]}
    labels={labels}
  />
);
