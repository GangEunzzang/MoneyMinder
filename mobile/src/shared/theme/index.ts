import { useColorScheme } from 'react-native';

import { palette, type Palette } from './tokens';

export * from './fonts';
export * from './tokens';

export function useColors(): Palette {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}

/** 지출은 ink(검정), 수입만 mintText. 부호가 아니라 의미로 색을 정한다. */
export function amountColor(c: Palette, type: 'expense' | 'income') {
  return type === 'income' ? c.mintText : c.ink;
}

/** 증감률 색: 지출이 늘면 red, 줄면 mintText. 변화가 없으면 색을 얹지 않는다. */
export function deltaColor(c: Palette, delta: number) {
  if (delta === 0) return c.smoke;

  return delta > 0 ? c.red : c.mintText;
}
