import { type ReactNode } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { won } from '../lib/format';
import { type ColorName, fontFamilyFor, space, type as typeScale, useColors } from '../theme';
import { Row, Stack } from './layout';
import { Text } from './Text';

const DIGITS = /\D/g;

type AmountProps = {
  /** "얼마를 쓰셨나요?" — 질문형. 라벨이 아니라 말을 건다. */
  eyebrow: string;
  /** 저장을 막은 이유를 여기서 말한다 (펜슬 Add-Error). */
  eyebrowColor?: ColorName;
  value: string;
  onChange: (next: string) => void;
  sign?: string;
  color?: ColorName;
};

/** 기록·고정지출이 공유하는 큰 금액 입력. 화면에서 가장 큰 글자라 시선이 여기 먼저 온다. */
export function AmountField({
  eyebrow,
  eyebrowColor = 'smoke',
  value,
  onChange,
  sign,
  color = 'ink',
}: AmountProps) {
  const c = useColors();
  // 이미 콤마가 찍힌 문자열이 들어와도 NaN 이 되지 않게 한다.
  const digits = value.replace(DIGITS, '');

  return (
    <Stack gap="sm" center style={styles.amountWrap}>
      <Text variant="caption" color={eyebrowColor}>
        {eyebrow}
      </Text>
      <Row gap="xxs" center>
        <TextInput
          value={digits ? (sign ?? '') + won(Number(digits)) : ''}
          onChangeText={(next) => onChange(next.replace(DIGITS, ''))}
          keyboardType="number-pad"
          maxLength={12}
          selectTextOnFocus
          placeholder="0"
          placeholderTextColor={c.mist}
          accessibilityLabel="금액"
          style={[
            styles.amountInput,
            typeScale.display,
            { fontFamily: fontFamilyFor(typeScale.display.fontWeight), color: c[color] },
          ]}
        />
        <Text variant="title3Soft" color="smoke">
          원
        </Text>
      </Row>
    </Stack>
  );
}

type FieldProps = {
  label: string;
  /** 값 표시만 할 때. 입력이 필요하면 input을 넘긴다. */
  value?: string;
  input?: ReactNode;
  divider?: boolean;
  onPress?: () => void;
};

export function FieldRow({ label, value, input, divider }: FieldProps) {
  return (
    <Row between py="xl" divider={divider}>
      <Text variant="callout" color="inkSoft">
        {label}
      </Text>
      {input ?? (
        <Text variant="callout" color={value ? 'ink' : 'mist'}>
          {value || '입력'}
        </Text>
      )}
    </Row>
  );
}

/**
 * 읽기 전용 라벨-값 행. `FieldRow` 는 폼(13)이고 이건 읽으러 온 화면(14) —
 * 펜슬이 두 크기를 따로 정해 뒀다. 값이 주인공이므로 라벨을 흐리게 둔다.
 */
export function DetailRow({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <Row between py="xl" divider={divider}>
      <Text variant="bodySoft" color="smoke">
        {label}
      </Text>
      <Text variant="body" numberOfLines={1} style={styles.detailValue}>
        {value}
      </Text>
    </Row>
  );
}

/** FieldRow 안에 들어가는 우측 정렬 입력. 라벨과 값이 한 줄에서 균형을 잡는다. */
export function FieldInput(props: TextInputProps) {
  const c = useColors();

  return (
    <TextInput
      placeholderTextColor={c.mist}
      {...props}
      style={[
        styles.fieldInput,
        typeScale.callout,
        { fontFamily: fontFamilyFor(typeScale.callout.fontWeight), color: c.ink },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  amountWrap: { paddingVertical: space['5xl'] },
  amountInput: { minWidth: 40, maxWidth: 220, padding: 0, textAlign: 'right', fontVariant: ['tabular-nums'] },
  fieldInput: { minWidth: 140, padding: 0, textAlign: 'right' },
  detailValue: { flexShrink: 1, paddingLeft: space['3xl'] },
});
