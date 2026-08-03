/**
 * 서버 카테고리는 코드(DC006)와 이름만 갖고, 아이콘·색은 앱이 정한다.
 */

/** 서버 기본 카테고리 코드 ↔ 앱 카테고리. 서버엔 아이콘·색이 없어 여기서 붙인다. */
const CODE_TO_APP: Record<string, string> = {
  DC001: 'salary',
  DC002: 'salary',
  DC003: 'salary',
  DC004: 'salary',
  DC005: 'etc',
  DC006: 'food',
  DC007: 'transport',
  DC008: 'living',
  DC009: 'telecom',
  DC010: 'living',
  DC011: 'etc',
  DC012: 'culture',
  DC013: 'beauty',
  DC014: 'health',
  DC015: 'culture',
  DC016: 'etc',
  DC017: 'etc',
};

const APP_TO_CODE: Record<string, string> = {
  salary: 'DC001',
  food: 'DC006',
  cafe: 'DC006',
  transport: 'DC007',
  living: 'DC008',
  telecom: 'DC009',
  shopping: 'DC010',
  culture: 'DC012',
  beauty: 'DC013',
  health: 'DC014',
  education: 'DC012',
  travel: 'DC015',
  subscription: 'DC009',
  etc: 'DC017',
};

export function toAppCategoryId(categoryCode: string): string {
  return CODE_TO_APP[categoryCode] ?? 'etc';
}

export function toServerCategoryCode(appCategoryId: string): string {
  return APP_TO_CODE[appCategoryId] ?? 'DC017';
}
