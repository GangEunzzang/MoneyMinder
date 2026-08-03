import { AmountText, HeroCard, Row, Text, WeekDots } from 'moneyminder-mobile';

/** 화면 맨 위에서 주제를 한 덩어리로 말하는 자리 — 흰 Card 와 짝이다. */
export const Streak = () => (
  <HeroCard gap="2xl">
    <Row between center>
      <Text variant="callout" color="onColorHigh">연속 무지출</Text>
      <Text variant="microBold" color="onColor">최장 21일</Text>
    </Row>
    <AmountText value="12" unit="일째" size="display" color="onColor" />
    <WeekDots week={[true, true, true, true, true, false, false]} todayIndex={4} onColor />
  </HeroCard>
);

/** 면은 violetFill. 다크에서 violet 을 그대로 쓰면 흰 글씨가 2.88:1 이 된다. */
export const Simple = () => (
  <HeroCard gap="xs">
    <Text variant="callout" color="onColorHigh">무지출로 아낀 돈</Text>
    <AmountText value="194,552" size="display" color="onColor" />
  </HeroCard>
);
