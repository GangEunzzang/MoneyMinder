import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { pressedStyle, radius, useColors } from '../theme';
import { Row, Stack } from './layout';
import { Text } from './Text';

/** 달력은 일요일 시작. 주간 미션(월 시작)과 용도가 다르다. */
const HEADS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export type DayCell = {
  /** YYYY-MM-DD */
  key: string;
  day: number;
  /** 이번 달이 아니거나 아직 오지 않은 날. */
  muted?: boolean;
  /** 칠해진 원 안에 들어가는 날. 무지출 성공처럼 "해낸 날". */
  filled?: boolean;
  /** 원 색. filled 일 때만 쓴다. */
  tone?: 'violet' | 'mint';
  /** 날짜 아래 한 줄 (금액 등). */
  note?: string;
};

/**
 * 월 달력 그리드. 요일 머리글은 주말만 색이 다르다 —
 * 일곱 개가 전부 회색이면 주가 어디서 끊기는지 안 보인다.
 */
export function Calendar({
  title,
  cells,
  onPressDay,
  footer,
}: {
  title: string;
  cells: DayCell[];
  onPressDay?: (key: string) => void;
  footer?: ReactNode;
}) {
  const c = useColors();
  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <Stack gap="3xl">
      <Text variant="subheadFlat">{title}</Text>

      <Row between>
        {HEADS.map((h, i) => (
          <Stack key={h} center style={styles.cell}>
            <Text variant="microBold" color={i === 0 ? 'red' : i === 6 ? 'violet' : 'smoke'}>
              {h}
            </Text>
          </Stack>
        ))}
      </Row>

      <Stack gap="md">
        {weeks.map((week) => (
          <Row key={week[0]?.key ?? week.length} between>
            {week.map((cell) => (
              <Pressable
                key={cell.key}
                disabled={!onPressDay || cell.muted}
                onPress={() => onPressDay?.(cell.key)}
                style={(state) => [styles.cell, pressedStyle(state)]}
              >
                <Stack gap="xxs" center>
                  <View
                    style={[
                      styles.disc,
                      cell.filled
                        ? { backgroundColor: cell.tone === 'mint' ? c.mint : c.violet }
                        : null,
                    ]}
                  >
                    <Text
                      variant={cell.filled ? 'caption' : 'captionSoft'}
                      color={cell.filled ? 'onColor' : cell.muted ? 'mist' : 'inkSoft'}
                    >
                      {cell.day > 0 ? cell.day : ''}
                    </Text>
                  </View>
                  <Text variant="nano" color="inkSoft" numberOfLines={1}>
                    {cell.note ?? ' '}
                  </Text>
                </Stack>
              </Pressable>
            ))}
          </Row>
        ))}
      </Stack>

      {footer}
    </Stack>
  );
}

/** 그 달의 1일부터 말일까지, 앞쪽 빈칸을 채워 7의 배수로 맞춘 셀 목록. */
export function monthCells(
  ym: string,
  build: (key: string, day: number) => Omit<DayCell, 'key' | 'day'>,
): DayCell[] {
  const [y, m] = ym.split('-').map(Number);
  const lead = new Date(y, m - 1, 1).getDay();
  const last = new Date(y, m, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = 0; i < lead; i += 1) {
    cells.push({ key: `pad-${i}`, day: 0, muted: true });
  }
  for (let day = 1; day <= last; day += 1) {
    const key = `${ym}-${String(day).padStart(2, '0')}`;
    cells.push({ key, day, ...build(key, day) });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ key: `tail-${cells.length}`, day: 0, muted: true });
  }

  return cells;
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: 'center' },
  disc: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
