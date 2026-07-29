import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24' as const });
const stroke = (color: string, w: number) => ({
  fill: 'none' as const,
  stroke: color,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconWallet({ size = 22, color = '#191F28', strokeWidth = 2.1 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={4} y={7} width={16} height={12} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M4 10.5C4 8.6 5.6 7 7.5 7H16" {...stroke(color, strokeWidth)} />
      <Circle cx={16} cy={13.5} r={1.4} fill={color} />
    </Svg>
  );
}
export function IconHome({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9.5z" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconList({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M8 7h11M8 12h11M8 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconFlame({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 3c1 3 4 4 4 8a4 4 0 01-8 0c0-2 1-3 1.5-4 .5 2 2.5 2.5 2.5 0z" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconPerson({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={12} cy={8} r={3} {...stroke(color, strokeWidth)} />
      <Path d="M5.5 20a6.5 6.5 0 0113 0" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconReceipt({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M5 3v18l2.5-1.6L10 21l2-1.6L14 21l2.5-1.6L19 21V3H5Z" {...stroke(color, strokeWidth)} />
      <Path d="M9 8h6M9 12h6" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconGrid({ size = 22, color = '#191F28', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={3} y={3} width={7.5} height={7.5} rx={2} {...stroke(color, strokeWidth)} />
      <Rect x={13.5} y={3} width={7.5} height={7.5} rx={2} {...stroke(color, strokeWidth)} />
      <Rect x={3} y={13.5} width={7.5} height={7.5} rx={2} {...stroke(color, strokeWidth)} />
      <Rect x={13.5} y={13.5} width={7.5} height={7.5} rx={2} {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconPlus({ size = 22, color = '#191F28', strokeWidth = 2.3 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 5v14M5 12h14" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconCheck({ size = 22, color = '#191F28', strokeWidth = 2.3 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M5 12l5 5L20 7" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconChevronRight({ size = 18, color = '#B0B8C1', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M9 6l6 6-6 6" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconChevronDown({ size = 18, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M6 9l6 6 6-6" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconChevronLeft({ size = 18, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M15 6l-6 6 6 6" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconArrowDown({ size = 18, color = '#00C896', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 4v13m0 0l-5-5m5 5l5-5" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconCafe({ size = 18, color = '#4E5968', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M6 9h10v5.5a4 4 0 01-4 4h-2a4 4 0 01-4-4V9z" {...stroke(color, strokeWidth)} />
      <Path d="M16 10.5h1.3a2.4 2.4 0 010 4.8H16" {...stroke(color, strokeWidth)} />
      <Path d="M9 4.5v2M13 4.5v2" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}
export function IconBell({ size = 20, color = '#4E5968', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 4a5 5 0 015 5c0 4 2 5 2 5H5s2-1 2-5a5 5 0 015-5zM10 20a2 2 0 004 0" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconCard({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={2} y={5} width={20} height={14} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M2 10h20" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconRepeat({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="m17 2 4 4-4 4" {...stroke(color, strokeWidth)} />
      <Path d="M3 11V9a4 4 0 0 1 4-4h14" {...stroke(color, strokeWidth)} />
      <Path d="m7 22-4-4 4-4" {...stroke(color, strokeWidth)} />
      <Path d="M21 13v2a4 4 0 0 1-4 4H3" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconChart({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M3 20V10M9 20V4M15 20v-7M21 20V8" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconPiggy({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path
        d="M4 12a6 6 0 0 1 6-6h4a6 6 0 0 1 5.2 3H21v4h-1.6A6 6 0 0 1 17 16.5V20h-3v-2h-4v2H7v-3.5A6 6 0 0 1 4 12Z"
        {...stroke(color, strokeWidth)}
      />
      <Path d="M10 6V4.5" {...stroke(color, strokeWidth)} />
      <Circle cx={15.5} cy={11} r={1} fill={color} />
    </Svg>
  );
}

export function IconAward({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={12} cy={9} r={5.5} {...stroke(color, strokeWidth)} />
      <Path d="m8.5 13.8-1.3 7L12 18l4.8 2.8-1.3-7" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconTrophy({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" {...stroke(color, strokeWidth)} />
      <Path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 8 11M17 6h2.5v1.5A3.5 3.5 0 0 1 16 11" {...stroke(color, strokeWidth)} />
      <Path d="M12 14v4M9 21h6M10 18h4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconTarget({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={12} cy={12} r={8} {...stroke(color, strokeWidth)} />
      <Circle cx={12} cy={12} r={3.5} {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconSettings({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 6h10M18 6h2M4 18h2M10 18h10" {...stroke(color, strokeWidth)} />
      <Circle cx={16} cy={6} r={2.2} {...stroke(color, strokeWidth)} />
      <Circle cx={8} cy={18} r={2.2} {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconBank({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M3 10 12 4l9 6" {...stroke(color, strokeWidth)} />
      <Path d="M5 10v9M19 10v9M9 10v9M15 10v9M3 20h18" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconBus({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={4} y={3} width={16} height={14} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M4 10h16M7 21l2-4M17 21l-2-4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconBag({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4Z" {...stroke(color, strokeWidth)} />
      <Path d="M4 6h16M9 10a3 3 0 0 0 6 0" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconUtensils({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 3v7a3 3 0 0 0 6 0V3M7 10v11" {...stroke(color, strokeWidth)} />
      <Path d="M17 3c-1.5 2-2 4-2 6h4c0-2-.5-4-2-6ZM17 9v12" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconTv({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={2.5} y={7} width={19} height={13} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="m8 3 4 4 4-4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconFilm({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={3} y={4} width={18} height={16} rx={2.5} {...stroke(color, strokeWidth)} />
      <Path d="M8 4v16M16 4v16M3 12h18" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconHealth({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={3} y={6} width={18} height={14} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M9 6V4h6v2M12 10v6M9 13h6" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconBook({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 4h10a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3V4Z" {...stroke(color, strokeWidth)} />
      <Path d="M17 7h3v13h-3" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconPhone({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={6} y={2.5} width={12} height={19} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M11 18.5h2" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconScissors({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={6} cy={18} r={2.5} {...stroke(color, strokeWidth)} />
      <Circle cx={18} cy={18} r={2.5} {...stroke(color, strokeWidth)} />
      <Path d="M7.7 16.3 18 4M16.3 16.3 6 4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconPlane({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M2 13.5 21.5 5 15 21l-3.5-6.5L2 13.5Z" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconSearch({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={11} cy={11} r={7} {...stroke(color, strokeWidth)} />
      <Path d="m16.5 16.5 4 4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconFilter({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconCalendar({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Rect x={3} y={5} width={18} height={16} rx={3} {...stroke(color, strokeWidth)} />
      <Path d="M3 10h18M8 3v4M16 3v4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconDownload({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" {...stroke(color, strokeWidth)} />
      <Path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconTrash({ size = 20, color = '#E5484D', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 7h16M10 4h4M6 7l1 13h10l1-13" {...stroke(color, strokeWidth)} />
      <Path d="M10 11v5M14 11v5" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconPencil({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M4 20h4L20 8l-4-4L4 16v4Z" {...stroke(color, strokeWidth)} />
      <Path d="M14 6l4 4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconShare({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={18} cy={5} r={3} {...stroke(color, strokeWidth)} />
      <Circle cx={6} cy={12} r={3} {...stroke(color, strokeWidth)} />
      <Circle cx={18} cy={19} r={3} {...stroke(color, strokeWidth)} />
      <Path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

export function IconWarning({ size = 20, color = '#7C5CFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M12 4 2.5 20h19L12 4Z" {...stroke(color, strokeWidth)} />
      <Path d="M12 10v4M12 17h.01" {...stroke(color, strokeWidth)} />
    </Svg>
  );
}

/** 축하 모먼트 전용. 선 아이콘 하나로는 "해냈다"가 안 읽혀서 폭죽 줄기를 함께 그린다. */
export function IconPartyPopper({ size = 20, color = '#FFFFFF', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Path d="M3.5 20.5 8 9l7 7-11.5 4.5Z" {...stroke(color, strokeWidth)} />
      <Path d="M10 11.5 12.5 14" {...stroke(color, strokeWidth)} />
      <Path d="M14.5 3.5v2M20.5 9.5h-2M18.8 5.2l-1.4 1.4" {...stroke(color, strokeWidth)} />
      <Circle cx={20} cy={15} r={1.1} fill={color} />
      <Circle cx={11} cy={4} r={1.1} fill={color} />
    </Svg>
  );
}
