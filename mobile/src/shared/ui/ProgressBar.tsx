import { StyleSheet, View } from 'react-native';

import { type ColorName, radius, space, useColors } from '../theme';
import { NumText } from './Text';

type Props = {
  /** 0~1. 범위 밖은 잘라낸다. */
  value: number;
  color?: ColorName;
  height?: number;
  /** 바 안에 표시할 라벨 (월 결산 카테고리 바). */
  label?: string;
};

/** 예산 게이지 · 미션 진행 · 카테고리 비중이 전부 이걸 쓴다. */
export function ProgressBar({ value, color = 'violet', height = 6, label }: Props) {
  const c = useColors();
  const ratio = Math.max(0, Math.min(1, value));
  const filled = `${ratio * 100}%` as const;

  return (
    <View style={[styles.track, { height, backgroundColor: c.hair }]}>
      <View
        style={[
          styles.fill,
          { width: filled, height, backgroundColor: c[color] },
          label ? styles.labelled : null,
        ]}
      >
        {label ? (
          <NumText variant="nano" style={{ color: c.onColor }}>
            {label}
          </NumText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
  fill: { borderRadius: radius.pill },
  labelled: { alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: space.md },
});
