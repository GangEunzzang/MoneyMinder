import { Pressable } from 'react-native';

import { monthHeading, monthKey, shiftMonth } from '../lib/format';
import { pressedStyle } from '../theme';
import { Row } from './layout';
import { Text } from './Text';

/**
 * 월 이동 한 줄. 앞으로 갈 수 있는 끝은 항상 이번 달이다 —
 * 아직 오지 않은 달의 지출을 보여줄 이유가 없다.
 */
export function MonthPager({ ym, onChange }: { ym: string; onChange: (next: string) => void }) {
  const atNow = ym >= monthKey(new Date());

  return (
    <Row between center>
      <Pressable onPress={() => onChange(shiftMonth(ym, -1))} hitSlop={10} style={pressedStyle}>
        <Text variant="callout" color="smoke">
          이전
        </Text>
      </Pressable>
      <Text variant="calloutBold">{monthHeading(ym)}</Text>
      <Pressable
        onPress={() => onChange(shiftMonth(ym, 1))}
        hitSlop={10}
        disabled={atNow}
        style={pressedStyle}
      >
        <Text variant="callout" color={atNow ? 'mist' : 'smoke'}>
          다음
        </Text>
      </Pressable>
    </Row>
  );
}
