import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

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
      <Path d="M7 8h10l-.8 8a2 2 0 01-2 1.8H9.8a2 2 0 01-2-1.8L7 8zM9.5 8V6a2.5 2.5 0 015 0v2" {...stroke(color, strokeWidth)} />
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

export function IconTarget({ size = 20, color = '#191F28', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)}>
      <Circle cx={12} cy={12} r={8} {...stroke(color, strokeWidth)} />
      <Circle cx={12} cy={12} r={3.5} {...stroke(color, strokeWidth)} />
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
