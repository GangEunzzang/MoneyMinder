import {
  StyleSheet,
  Text as RNText,
  type TextProps,
  View,
  type ViewStyle,
} from 'react-native';

import {
  type ColorName,
  fontFamilyFor,
  type TypeName,
  type as typeScale,
  useColors,
} from '../theme';

type Props = TextProps & {
  /** 타입 스케일 토큰. 자유 fontSize 금지 (D23). */
  variant?: TypeName;
  color?: ColorName;
};

/**
 * 앱의 모든 텍스트는 이걸 쓴다. RN Text 직접 사용은 ESLint가 막는다.
 * variant/color 밖으로 나갈 수 없으므로 스케일이 코드에서 새지 않는다.
 */
export function Text({ variant = 'body', color = 'ink', style, ...rest }: Props) {
  const c = useColors();
  const scale = typeScale[variant];

  return (
    <RNText
      style={[scale, { fontFamily: fontFamilyFor(scale.fontWeight), color: c[color] }, style]}
      {...rest}
    />
  );
}

/** 숫자가 세로로 정렬돼야 하는 자리 (금액·통계). */
export function NumText({ style, ...rest }: Props) {
  return <Text style={[styles.tabular, style]} {...rest} />;
}

/** 금액 크기별로 짝이 되는 "원" 크기. 펜슬이 쓰는 조합 그대로다. */
const UNIT: Record<'display' | 'title1' | 'title2Soft', TypeName> = {
  display: 'title3Soft',
  title1: 'headline',
  title2Soft: 'calloutBold',
};

/**
 * 금액 + 단위. "원"을 숫자와 같은 크기로 찍으면 숫자가 안 커 보인다 —
 * 단위는 한 단계 작게, 밑선을 맞춘다.
 */
export function AmountText({
  value,
  size = 'title1',
  color = 'ink',
  unit = '원',
  style,
}: {
  value: string;
  size?: keyof typeof UNIT;
  color?: ColorName;
  unit?: string;
  style?: ViewStyle;
}) {
  // 컬러 배경 위에서는 회색 단위가 배경에 묻힌다. 글자색을 따라간다.
  const unitColor: ColorName = color === 'onColor' ? 'onColorHigh' : 'smoke';

  return (
    <View style={[styles.amount, style]}>
      <NumText variant={size} color={color}>
        {value}
      </NumText>
      <Text variant={UNIT[size]} color={unitColor}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
  amount: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
});
