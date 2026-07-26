import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#191F28',
    background: '#FFFFFF',
    backgroundElement: '#F9FAFB',
    backgroundSelected: '#F2F4F6',
    textSecondary: '#4E5968',
    ink: '#191F28',
    inkSoft: '#4E5968',
    smoke: '#6B7684',
    mist: '#B0B8C1',
    surface: '#F9FAFB',
    surface2: '#F2F4F6',
    hair: '#F2F4F6',
    hairStrong: '#E5E8EB',
    violet: '#7C5CFF',
    violetSoft: '#EFEAFF',
    violetDeep: '#5947C2',
    mint: '#00C896',
    mintSoft: '#D5F2E7',
    peach: '#FF8A66',
    red: '#E5484D',
    redSoft: '#FDECEC',
    onViolet: '#FFFFFF',
  },
  dark: {
    text: '#EDECF2',
    background: '#17151D',
    backgroundElement: '#1E1C26',
    backgroundSelected: '#252331',
    textSecondary: '#B3B0C2',
    ink: '#EDECF2',
    inkSoft: '#B3B0C2',
    smoke: '#8A879A',
    mist: '#5B586B',
    surface: '#1E1C26',
    surface2: '#252331',
    hair: '#242230',
    hairStrong: '#2F2C3D',
    violet: '#9D86FF',
    violetSoft: '#241F3D',
    violetDeep: '#C4B5FD',
    mint: '#2BD6A6',
    mintSoft: '#12332A',
    peach: '#FF9D7D',
    red: '#FF6B6F',
    redSoft: '#38222A',
    onViolet: '#FFFFFF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 9,
  card: 13,
  lg: 18,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
