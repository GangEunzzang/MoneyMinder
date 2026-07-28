import { Pressable, StyleSheet, View } from 'react-native';

import { space } from '../theme';
import { Text } from './Text';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['00', '0', '⌫'],
] as const;

const MAX_DIGITS = 12;

/** 지운다는 뜻의 키. 값이 아니라 동작이라 눌렀을 때 처리를 따로 한다. */
const BACKSPACE = '⌫';

/**
 * 금액 전용 키패드. 시스템 키보드를 쓰지 않는 이유는 두 가지다.
 *  - 숫자만 받으면 되는데 자판 전체가 올라오면 화면 절반이 사라진다.
 *  - 시안이 카테고리·결제수단을 키패드와 같은 화면에 놓았다. 자판이 덮으면 못 고른다.
 */
export function Keypad({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const press = (key: string) => {
    if (key === BACKSPACE) {
      onChange(value.slice(0, -1));

      return;
    }
    // 0 만 남는 입력은 만들지 않는다 — "000" 은 금액이 아니다.
    const next = value === '' && key.startsWith('0') ? '' : value + key;
    if (next.length <= MAX_DIGITS) onChange(next);
  };

  return (
    <View style={styles.pad}>
      {KEYS.map((row) => (
        <View key={row.join()} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === BACKSPACE ? '지우기' : key}
              onPress={() => press(key)}
              style={({ pressed }) => [styles.key, pressed ? styles.pressed : null]}
            >
              <Text variant={key === BACKSPACE ? 'keypadSmall' : 'keypad'}>{key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: space['3xl'], paddingHorizontal: space.lg, paddingBottom: space.sm, gap: space.xxs },
  row: { flexDirection: 'row', gap: space.xxs },
  key: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.4 },
});
