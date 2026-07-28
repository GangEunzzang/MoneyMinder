import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { type ColorName, type TypeName, type as typeScale, useColors } from '../theme';

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

  return <RNText style={[typeScale[variant], { color: c[color] }, style]} {...rest} />;
}

/** 숫자가 세로로 정렬돼야 하는 자리 (금액·통계). */
export function NumText({ style, ...rest }: Props) {
  return <Text style={[styles.tabular, style]} {...rest} />;
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
