import { Card, HeroCard, WeekDots } from 'moneyminder-mobile';

/** 보라 히어로 위. 명암만 뒤집고 크기·간격은 흰 카드 위와 같아야 한다. */
export const OnHero = () => (
  <HeroCard>
    <WeekDots week={[true, true, true, true, true, false, false]} todayIndex={4} onColor />
  </HeroCard>
);

/** 흰 카드 위. 오늘은 채워지지 않았으면 링으로 표시된다. */
export const OnCard = () => (
  <Card>
    <WeekDots week={[false, false, true, false, false, false, false]} todayIndex={3} />
  </Card>
);
