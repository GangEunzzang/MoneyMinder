import type { ComponentProps } from 'react';

import type { ColorName } from '../theme';
import { useColors } from '../theme';
import {
  IconBag,
  IconBook,
  IconBus,
  IconCafe,
  IconCard,
  IconFilm,
  IconHealth,
  IconHome,
  IconPhone,
  IconPlane,
  IconRepeat,
  IconScissors,
  IconUtensils,
  IconWallet,
} from './icons';
import { IconBadge } from './ListRow';

const MAP = {
  cafe: IconCafe,
  utensils: IconUtensils,
  bus: IconBus,
  bag: IconBag,
  repeat: IconRepeat,
  wallet: IconWallet,
  card: IconCard,
  film: IconFilm,
  health: IconHealth,
  book: IconBook,
  house: IconHome,
  phone: IconPhone,
  scissors: IconScissors,
  plane: IconPlane,
} as const;

export type IconKey = keyof typeof MAP;

/** 카테고리·고정지출·결제수단 행이 공유하는 아이콘 배지. */
export function CategoryIcon({
  icon,
  tint = 'inkSoft',
  tintSoft = 'surface2',
  size = 40,
  round,
  dimmed,
}: {
  icon: IconKey;
  tint?: ColorName;
  tintSoft?: ColorName;
  size?: number;
  round?: ComponentProps<typeof IconBadge>['round'];
  dimmed?: boolean;
}) {
  const c = useColors();
  const Cmp = MAP[icon] ?? IconWallet;

  return (
    <IconBadge tone={tintSoft} size={size} round={round} dimmed={dimmed}>
      <Cmp size={Math.round(size * 0.5)} color={c[tint]} />
    </IconBadge>
  );
}
