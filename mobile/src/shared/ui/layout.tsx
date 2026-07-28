import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { radius, screenPadding, shadow, space, useColors } from '../theme';
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
        // center 가 justifyContent 를 함께 잡으므로 between 이 뒤에 와야 한다.
        // 순서를 바꾸면 `<Row between center>` 가 조용히 가운데 정렬로 무너진다.
        center && styles.center,
        between && styles.between,
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

/**
 * 흰 카드. 회색 배경 위에 올라가는 모든 덩어리가 이걸 쓴다.
 * `list` 는 행이 자기 위아래 여백을 갖는 경우 — 카드가 또 여백을 주면 첫 행이 밀려 내려간다.
 */
export function Card({
  children,
  list,
  style,
}: {
  children: ReactNode;
  list?: boolean;
  style?: ViewStyle;
}) {
  const c = useColors();

  return (
    <View
      style={[
        styles.card,
        shadow.card,
        list ? styles.cardList : styles.cardPad,
        { backgroundColor: c.surface },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stack: { flexDirection: 'column' },
  between: { justifyContent: 'space-between' },
  center: { alignItems: 'center', justifyContent: 'center' },
  spring: { flex: 1 },
  body: { flex: 1, paddingHorizontal: screenPadding },
  card: { borderRadius: radius.card },
  cardPad: { padding: space['3xl'] },
  cardList: { paddingHorizontal: space['3xl'], paddingVertical: space.xxs },
});
