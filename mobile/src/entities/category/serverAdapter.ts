import type { CategoryInput, ServerCategory } from '@/shared/lib/api';

import { CATEGORY_ICONS, CATEGORY_TINTS, type Category, type IconKey } from './model';

/** 서버는 tint 만 안다. 짝인 tintSoft 는 여기서 되찾는다. */
function tintPair(color: string | null): { tint: Category['tint']; tintSoft: Category['tintSoft'] } {
  return CATEGORY_TINTS.find((t) => t.tint === color) ?? CATEGORY_TINTS[0];
}

function iconOf(icon: string | null): IconKey {
  return CATEGORY_ICONS.includes(icon as IconKey) ? (icon as IconKey) : 'wallet';
}

export function toAppCategory(server: ServerCategory, id: string): Category {
  return {
    id,
    label: server.categoryName,
    icon: iconOf(server.icon),
    ...tintPair(server.color),
    ...(server.categoryType === 'INCOME' ? { income: true } : {}),
  };
}

export function toCategoryInput(category: Category): CategoryInput {
  return {
    categoryName: category.label,
    categoryType: category.income ? 'INCOME' : 'EXPENSE',
    description: category.label,
    icon: category.icon,
    color: category.tint,
  };
}
