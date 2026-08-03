import { Chip, Row } from 'moneyminder-mobile';

/** 기록 화면 카테고리 선택. 선택은 violetFill — 앱의 다른 활성 상태(탭바·토글·도트)와 같은 색이다. */
export const Categories = () => (
  <Row gap="md" style={{ flexWrap: 'wrap', rowGap: 8 }}>
    {['식비', '카페·간식', '교통', '쇼핑', '문화', '의료'].map((c, i) => (
      <Chip key={c} label={c} selected={i === 1} onPress={() => {}} />
    ))}
  </Row>
);

export const States = () => (
  <Row gap="md">
    <Chip label="선택됨" selected onPress={() => {}} />
    <Chip label="선택 안 됨" onPress={() => {}} />
  </Row>
);
