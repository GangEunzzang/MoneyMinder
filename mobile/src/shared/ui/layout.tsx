import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { screenPadding, space, useColors } from '../theme';
import { Text } from './Text';

type Gap = keyof typeof space;

type RowProps = ViewProps & {
  gap?: Gap;
  /** 양끝 정렬 — 라벨/값 행에서 가장 흔한 형태. */
  between?: boolean;
  center?: boolean;
  /** 위쪽 헤어라인. 리스트에서 첫 행만 빼고 켠다. */
  divider?: boolean;
  py?: Gap;
};

export function Row({ gap, between, center, divider, py, style, ...rest }: RowProps) {
  const c = useColors();

  return (
    <View
      style={[
        styles.row,
        gap != null && { gap: space[gap] },
        between && styles.between,
        center && styles.center,
        py != null && { paddingVertical: space[py] },
        divider && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.hair },
        style,
      ]}
      {...rest}
    />
  );
}

type StackProps = ViewProps & { gap?: Gap; center?: boolean };

export function Stack({ gap, center, style, ...rest }: StackProps) {
  return (
    <View
      style={[styles.stack, gap != null && { gap: space[gap] }, center && styles.center, style]}
      {...rest}
    />
  );
}

/** 남은 세로 공간을 밀어내는 스페이서. 하단 고정 CTA에 쓴다. */
export function Spring() {
  return <View style={styles.spring} />;
}

export function Divider({ style }: { style?: ViewStyle }) {
  const c = useColors();

  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.hairStrong }, style]} />;
}

/** 섹션 헤딩 + 우측 메타. 목록 화면 전반에서 반복되는 형태. */
export function SectionHeader({
  title,
  meta,
  accent,
  first,
}: {
  title: string;
  meta?: string;
  accent?: boolean;
  first?: boolean;
}) {
  return (
    <Row between center style={{ paddingTop: first ? space.xl : space['5xl'], paddingBottom: space.md }}>
      <Text variant="subhead">{title}</Text>
      {meta ? (
        <Text variant="micro" color={accent ? 'violet' : 'mist'}>
          {meta}
        </Text>
      ) : null}
    </Row>
  );
}

export function ScreenBody({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.body, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stack: { flexDirection: 'column' },
  between: { justifyContent: 'space-between' },
  center: { alignItems: 'center', justifyContent: 'center' },
  spring: { flex: 1 },
  body: { flex: 1, paddingHorizontal: screenPadding },
});
