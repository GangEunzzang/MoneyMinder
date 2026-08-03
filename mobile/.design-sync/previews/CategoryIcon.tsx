import { CategoryIcon, Row } from 'moneyminder-mobile';

/** 카테고리 식별 배지. 목록·통계·상세에서 같은 색을 써야 같은 항목으로 읽힌다. */
export const Categories = () => (
  <Row gap="lg" style={{ flexWrap: 'wrap', rowGap: 12 }}>
    {([
      ['utensils', 'violet', 'violetSoft'],
      ['cafe', 'peach', 'peachSoft'],
      ['bus', 'mint', 'mintSoft'],
      ['bag', 'violetDeep', 'violetSoft'],
      ['film', 'violet', 'violetSoft'],
      ['health', 'red', 'redSoft'],
      ['house', 'peach', 'peachSoft'],
      ['phone', 'violetDeep', 'violetSoft'],
      ['tv', 'violetDeep', 'violetSoft'],
    ] as const).map(([icon, tint, soft]) => (
      <CategoryIcon key={icon} icon={icon} tint={tint} tintSoft={soft} />
    ))}
  </Row>
);

/** 거래 상세 히어로 — 크게, 그리고 회색으로. 이미 무엇인지 아는 화면에서 색은 소음이다. */
export const Hero = () => (
  <CategoryIcon icon="cafe" tint="peach" tintSoft="surface2" size={60} round="3xl" />
);
