import { type ReactNode } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { type ColorName, fontFamilyFor, space, type as typeScale, useColors } from '../theme';
import { Row, Stack } from './layout';
import { Text } from './Text';

const DIGITS = /\D/g;

type AmountProps = {
  /** "얼마를 쓰셨나요?" — 질문형. 라벨이 아니라 말을 건다. */
  eyebrow: string;
  value: string;
  onChange: (next: string) => void;
  sign?: string;
  color?: ColorName;
};

/** 기록·고정지출이 공유하는 큰 금액 입력. 화면에서 가장 큰 글자라 시선이 여기 먼저 온다. */
export function AmountField({ eyebrow, value, onChange, sign, color = 'ink' }: AmountProps) {
  const c = useColors();

  return (
    <Stack gap="sm" center style={styles.amountWrap}>
      <Text variant="caption" color="smoke">
        {eyebrow}
      </Text>
      <Row gap="xxs" center>
        {sign ? (
          <Text variant="title1" color={color}>
            {sign}
          </Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={(next) => onChange(next.replace(DIGITS, ''))}
          keyboardType="number-pad"
          maxLength={12}
          selectTextOnFocus
          placeholder="0"
          placeholderTextColor={c.mist}
          accessibilityLabel="금액"
          style={[
            styles.amountInput,
            typeScale.title1,
            { fontFamily: fontFamilyFor(typeScale.title1.fontWeight), color: c[color] },
          ]}
        />
        <Text variant="title3" color="smoke">
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
  amountInput: { minWidth: 40, maxWidth: 220, padding: 0, fontVariant: ['tabular-nums'] },
  fieldInput: { minWidth: 140, padding: 0, textAlign: 'right' },
});
