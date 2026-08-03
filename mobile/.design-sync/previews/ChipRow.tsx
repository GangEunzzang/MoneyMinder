import { ChipRow } from 'moneyminder-mobile';

/** 가로 스크롤 필터 줄. 개수가 늘어도 줄바꿈하지 않고 옆으로 흐른다. */
export const Filter = () => (
  <ChipRow items={['전체', '식비', '카페·간식', '교통', '쇼핑', '문화', '의료', '교육'] as const} value="전체" onChange={() => {}} />
);
