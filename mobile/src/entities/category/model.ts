import type { ColorName } from '@/shared/theme';

export type CategoryId = 'cafe' | 'food' | 'transport' | 'shopping' | 'subscription' | 'salary' | 'etc';

export type Category = {
  id: CategoryId;
  label: string;
  /** shared/ui/icons 의 아이콘 키. 화면은 이 키로 아이콘을 고른다. */
  icon: 'cafe' | 'utensils' | 'bus' | 'bag' | 'repeat' | 'wallet';
  tint: ColorName;
  tintSoft: ColorName;
};

export const CATEGORIES: readonly Category[] = [
  { id: 'cafe', label: '카페·간식', icon: 'cafe', tint: 'peach', tintSoft: 'peachSoft' },
  { id: 'food', label: '식비', icon: 'utensils', tint: 'violet', tintSoft: 'violetSoft' },
  { id: 'transport', label: '교통', icon: 'bus', tint: 'mint', tintSoft: 'mintSoft' },
  { id: 'shopping', label: '쇼핑', icon: 'bag', tint: 'violetDeep', tintSoft: 'violetSoft' },
  { id: 'subscription', label: '구독', icon: 'repeat', tint: 'red', tintSoft: 'redSoft' },
  { id: 'salary', label: '수입', icon: 'wallet', tint: 'mint', tintSoft: 'mintSoft' },
  { id: 'etc', label: '기타', icon: 'wallet', tint: 'mist', tintSoft: 'surface2' },
] as const;

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function findCategory(id: string): Category {
  return BY_ID.get(id as CategoryId) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'salary');
