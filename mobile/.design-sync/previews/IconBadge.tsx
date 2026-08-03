import { IconBadge, IconBell, IconCard, IconRepeat, Row } from 'moneyminder-mobile';

/** 목록 행의 왼쪽 배지. CategoryIcon 이 카테고리 전용이라면 이건 그 외 전부다. */
export const Tones = () => (
  <Row gap="lg" center>
    <IconBadge tone="violetSoft"><IconRepeat size={20} color="#7C5CFF" /></IconBadge>
    <IconBadge tone="peachSoft"><IconCard size={20} color="#F2994A" /></IconBadge>
    <IconBadge tone="surface2"><IconBell size={20} color="#626C77" /></IconBadge>
  </Row>
);

/** `dimmed` 는 못 누르는 행. `round`·`size` 로 거래 상세의 큰 배지까지 쓴다. */
export const Sizes = () => (
  <Row gap="lg" center>
    <IconBadge tone="violetSoft" size={32} round="md"><IconRepeat size={16} color="#7C5CFF" /></IconBadge>
    <IconBadge tone="violetSoft"><IconRepeat size={20} color="#7C5CFF" /></IconBadge>
    <IconBadge tone="surface2" size={60} round="3xl"><IconRepeat size={26} color="#626C77" /></IconBadge>
    <IconBadge tone="surface2" dimmed><IconRepeat size={20} color="#B0B8C1" /></IconBadge>
  </Row>
);
