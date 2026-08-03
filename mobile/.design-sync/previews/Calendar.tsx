import { Calendar, Text } from 'moneyminder-mobile';

const cells = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2;
  if (day < 1 || day > 31) return { key: `pad-${i}`, day: 0, muted: true };
  const win = [1, 2, 5, 6, 9, 12, 13, 17, 18, 21, 24, 25].includes(day);
  return {
    key: `2026-07-${String(day).padStart(2, '0')}`,
    day,
    muted: day > 30,
    filled: win,
    tone: 'violet' as const,
  };
});

/** 무지출 달력. 칠해진 원이 "해낸 날"이고, 요일 머리글은 주말만 색이 다르다. */
export const NoSpend = () => (
  <Calendar
    title="2026년 7월"
    cells={cells}
    onPressDay={() => {}}
    footer={<Text variant="caption" color="smoke">이번 달 12일 성공 · 최장 5일 연속</Text>}
  />
);

/** `note` 로 날짜 아래 한 줄. 금액이 들어가면 달력이 곧 요약이 된다. */
export const WithAmounts = () => (
  <Calendar
    title="2026년 7월"
    cells={cells.map((c) =>
      c.day && !c.filled ? { ...c, note: c.day % 3 === 0 ? '-12,400' : undefined } : c,
    )}
    onPressDay={() => {}}
  />
);
