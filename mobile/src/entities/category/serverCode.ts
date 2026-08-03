/**
 * 앱 카테고리 ↔ 서버 코드.
 *
 * 등록된 카테고리(store 의 server 맵)를 먼저 본다. 앱 카테고리는 제 이름·아이콘·색
 * 그대로 서버에 올라가므로 거래는 그 코드를 물고 간다.
 *
 * 아래 두 표는 그 전에 저장된 것을 읽기 위한 **폴백**이다. 14키 고정이라 사용자가
 * 만든 카테고리는 담기지 못했고, 왕복하면 카페→식비·교육→문화·구독→통신으로 접혔다.
 */

import { categoryIdOfCode, serverCodeOf } from './store';

/** 서버 기본 카테고리 코드 → 앱 시드 카테고리. */
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
  return categoryIdOfCode(categoryCode) ?? CODE_TO_APP[categoryCode] ?? 'etc';
}

export function toServerCategoryCode(appCategoryId: string): string {
  return serverCodeOf(appCategoryId) ?? APP_TO_CODE[appCategoryId] ?? 'DC017';
}
