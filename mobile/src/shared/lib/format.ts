const WON = new Intl.NumberFormat('ko-KR');

export function won(n: number): string {
  return WON.format(Math.round(n));
}

/** 금액 + 단위. 부호는 붙이지 않는다 — 색과 맥락이 의미를 전한다. */
export function wonUnit(n: number): string {
  return `${won(Math.abs(n))}원`;
}

/** 내역 행처럼 부호가 필요한 자리. */
export function signedWon(n: number): string {
  return `${n < 0 ? '-' : '+'}${won(Math.abs(n))}`;
}

export function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

/** 전월 대비 증감률. 기준이 0이면 비교 불가라 null. */
export function delta(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function signedPercent(v: number): string {
  return `${v > 0 ? '+' : ''}${v}%`;
}

export function toDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');

  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** YYYY-MM */
export function monthKey(d: Date): string {
  return toDateKey(d).slice(0, 7);
}

const DAY = 86_400_000;

export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / DAY);
}

/** "3일 뒤" / "오늘" / "어제" — 고정지출·내역 공통. */
export function relativeDay(days: number): string {
  if (days === 0) return '오늘';
  if (days === 1) return '내일';
  if (days === -1) return '어제';
  return days > 0 ? `${days}일 뒤` : `${-days}일 전`;
}

export const KOREAN_WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

/** 월요일 시작 주차 인덱스 (0=월). */
export function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function monthLabel(d: Date): string {
  return `${d.getMonth() + 1}월`;
}

/** 달력 순서(일 시작). 주간 미션의 KOREAN_WEEKDAYS(월 시작)와 용도가 다르다. */
const CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** "8월 5일 (화)" — 내역 날짜 구분선. */
export function dateHeading(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);

  return `${m}월 ${d}일 (${CALENDAR_WEEKDAYS[new Date(y, m - 1, d).getDay()]})`;
}

/** "2026년 8월" — 월 선택기·결산 헤더. */
export function monthHeading(ym: string): string {
  const [y, m] = ym.split('-').map(Number);

  return `${y}년 ${m}월`;
}

/** YYYY-MM 에서 offset 개월 이동. */
export function shiftMonth(ym: string, offset: number): string {
  const [y, m] = ym.split('-').map(Number);

  return monthKey(new Date(y, m - 1 + offset, 1));
}
