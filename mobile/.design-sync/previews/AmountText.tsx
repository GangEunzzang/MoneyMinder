import { AmountText, HeroCard } from 'moneyminder-mobile';

/** 거래 상세 히어로. title1 이 기본이고 단위는 짝인 headline 으로 한 급 작다. */
export const Default = () => <AmountText value="510,700" />;

/** 화면 전체를 지배하는 금액 — 기록·예산설정·결산. */
export const Display = () => <AmountText value="1,200,000" size="display" />;

/** 카드 안에 담기는 금액 — 홈 "이번 달 지출". */
export const InCard = () => <AmountText value="510,700" size="title2Soft" />;

/** 수입은 mintText. 채움용 mint 는 흰 배경에서 2.16:1 이라 글자로 쓰지 않는다. */
export const Income = () => <AmountText value="+2,600,000" size="title2Soft" color="mintText" />;

/** 단위는 "원"만이 아니다 — 스트릭은 "일째". 컬러 면 위에서는 color="onColor". */
export const OnColor = () => (
  <HeroCard>
    <AmountText value="12" unit="일째" size="display" color="onColor" />
  </HeroCard>
);
