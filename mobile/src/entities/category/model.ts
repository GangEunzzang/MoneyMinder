import type { ColorName } from '@/shared/theme';

/** shared/ui/icons 의 아이콘 키. 화면은 이 키로 아이콘을 고른다. */
export type IconKey =
  | 'cafe'
  | 'utensils'
  | 'bus'
  | 'bag'
  | 'repeat'
  | 'wallet'
  | 'tv'
  | 'film'
  | 'health'
  | 'book'
  | 'house'
  | 'phone'
  | 'scissors'
  | 'plane';

export type Category = {
  id: string;
  label: string;
  icon: IconKey;
  tint: ColorName;
  tintSoft: ColorName;
  /** 수입 카테고리는 지출 목록·통계에서 빠진다. */
  income?: boolean;
};

/** 카테고리를 만들 때 고를 수 있는 색. 팔레트에서 서로 구분되는 것만 골랐다. */
export const CATEGORY_TINTS: { tint: ColorName; tintSoft: ColorName }[] = [
  { tint: 'violet', tintSoft: 'violetSoft' },
  { tint: 'peach', tintSoft: 'peachSoft' },
  { tint: 'mint', tintSoft: 'mintSoft' },
  { tint: 'red', tintSoft: 'redSoft' },
  { tint: 'violetDeep', tintSoft: 'violetSoft' },
  { tint: 'mist', tintSoft: 'surface2' },
];

export const CATEGORY_ICONS: IconKey[] = [
  'utensils',
  'cafe',
  'bus',
  'bag',
  'film',
  'health',
  'book',
  'house',
  'phone',
  'scissors',
  'plane',
  'tv',
  'repeat',
  'wallet',
];

/** 첫 실행 시드. 사용자가 지우거나 이름을 바꿀 수 있다. */
export const SEED_CATEGORIES: readonly Category[] = [
  { id: 'food', label: '식비', icon: 'utensils', tint: 'violet', tintSoft: 'violetSoft' },
  { id: 'cafe', label: '카페·간식', icon: 'cafe', tint: 'peach', tintSoft: 'peachSoft' },
  { id: 'transport', label: '교통', icon: 'bus', tint: 'mint', tintSoft: 'mintSoft' },
  { id: 'shopping', label: '쇼핑', icon: 'bag', tint: 'violetDeep', tintSoft: 'violetSoft' },
  { id: 'culture', label: '문화', icon: 'film', tint: 'violet', tintSoft: 'violetSoft' },
  { id: 'health', label: '의료', icon: 'health', tint: 'red', tintSoft: 'redSoft' },
  { id: 'education', label: '교육', icon: 'book', tint: 'violetDeep', tintSoft: 'violetSoft' },
  { id: 'living', label: '생활', icon: 'house', tint: 'mint', tintSoft: 'mintSoft' },
  { id: 'telecom', label: '통신', icon: 'phone', tint: 'violet', tintSoft: 'violetSoft' },
  { id: 'beauty', label: '미용', icon: 'scissors', tint: 'peach', tintSoft: 'peachSoft' },
  { id: 'travel', label: '여행', icon: 'plane', tint: 'mint', tintSoft: 'mintSoft' },
  { id: 'subscription', label: '구독', icon: 'tv', tint: 'red', tintSoft: 'redSoft' },
  { id: 'salary', label: '수입', icon: 'wallet', tint: 'mint', tintSoft: 'mintSoft', income: true },
  { id: 'etc', label: '기타', icon: 'wallet', tint: 'mist', tintSoft: 'surface2' },
] as const;

/** 지워진 카테고리를 참조하는 옛 기록이 화면을 깨뜨리지 않도록 여기로 떨어뜨린다. */
export const FALLBACK: Category = {
  id: 'etc',
  label: '기타',
  icon: 'wallet',
  tint: 'mist',
  tintSoft: 'surface2',
};

export function findCategory(list: readonly Category[], id: string): Category {
  return list.find((c) => c.id === id) ?? FALLBACK;
}

export function expenseCategories(list: readonly Category[]): Category[] {
  return list.filter((c) => !c.income);
}

export function incomeCategories(list: readonly Category[]): Category[] {
  return list.filter((c) => c.income || c.id === 'etc');
}
