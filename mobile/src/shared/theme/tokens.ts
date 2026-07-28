/**
 * 펜슬 `moneyminder.pen` = 디자인 SSoT. 이 파일은 그 값의 코드 사본이다.
 * 값을 바꾸려면 펜슬 → 여기 순서. 스케일 밖 값은 ESLint가 막는다.
 */

export const palette = {
  light: {
    bg: '#F2F4F6',
    surface: '#FFFFFF',
    surface2: '#EEF1F4',
    hair: '#EDEFF2',
    hairStrong: '#E5E8EB',
    ink: '#191F28',
    inkSoft: '#4E5968',
    smoke: '#8B95A1',
    mist: '#B0B8C1',
    violet: '#7C5CFF',
    violetDeep: '#5947C2',
    violetSoft: '#EFEAFF',
    mint: '#00C896',
    mintSoft: '#E4F7F0',
    peach: '#FF8A66',
    peachSoft: '#FFF1EB',
    red: '#E5484D',
    redSoft: '#FDECEC',
    onColor: '#FFFFFF',
    /** 컬러 배경 위 오버레이 (칩·요일 도트). */
    onColorSoft: '#FFFFFF2E',
    /** 컬러 배경 위 텍스트 3단. 흰색 하나로는 본문·설명·라벨의 층이 무너진다. */
    onColorHigh: '#FFFFFFCC',
    onColorMid: '#FFFFFFB3',
    onColorLow: '#FFFFFF99',
    /** 브랜드 색과 스크림은 테마를 따르지 않는다 — 색 자체가 식별 수단이라 바뀌면 못 알아본다. */
    scrim: '#191F28B3',
    kakao: '#FEE500',
    kakaoInk: '#191600',
    apple: '#000000',
    google: '#4285F4',
  },
  dark: {
    bg: '#17151D',
    surface: '#1E1C26',
    surface2: '#252331',
    hair: '#242230',
    hairStrong: '#2F2C3D',
    ink: '#EDECF2',
    inkSoft: '#B3B0C2',
    smoke: '#8A879A',
    mist: '#5B586B',
    violet: '#9D86FF',
    violetDeep: '#C4B5FD',
    violetSoft: '#241F3D',
    mint: '#2BD6A6',
    mintSoft: '#12332A',
    peach: '#FF9D7D',
    peachSoft: '#3A2620',
    red: '#FF6B6F',
    redSoft: '#38222A',
    onColor: '#FFFFFF',
    onColorSoft: '#FFFFFF2E',
    onColorHigh: '#FFFFFFCC',
    onColorMid: '#FFFFFFB3',
    onColorLow: '#FFFFFF99',
    scrim: '#191F28B3',
    kakao: '#FEE500',
    kakaoInk: '#191600',
    apple: '#000000',
    google: '#4285F4',
  },
} as const;

export type ColorName = keyof typeof palette.light;
export type Palette = Record<ColorName, string>;

/**
 * D23/D25 — 펜슬 문서의 (크기 × 굵기 × 자간 × 줄간) 실측 조합.
 *
 * 크기당 굵기를 하나만 두면 디자인이 15/600을 쓸 때 코드가 담을 그릇이 없어
 * 15/800이나 14/600으로 어긋나게 찍힌다. 같은 크기의 굵기 변주를 전부 갖춰야
 * 시안과 코드가 일치할 수 있다. 이 밖의 fontSize 금지.
 *
 * 값은 펜슬 75화면 전수 집계(2026-07-28)에서 뽑았다. 자간이 0.2px 이내로만 갈리는
 * 조합은 빈도가 높은 쪽으로 합쳤다 — 그 차이는 글자 모양을 바꾸지 않지만,
 * **굵기와 줄간격은 합치지 않는다.** 굵기는 서체가 바뀌고 줄간격은 높이가 바뀐다.
 */
export const type = {
  display: { fontSize: 38, fontWeight: '800', letterSpacing: -1.5 },
  title1: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  title2: { fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  title2Soft: { fontSize: 26, fontWeight: '800', letterSpacing: -0.7 },
  title2Flat: { fontSize: 26, fontWeight: '800' },
  title2Light: { fontSize: 26, fontWeight: '700' },
  /** 기록 화면 키패드. 숫자는 굵으면 눌러야 할 것처럼 안 보인다 (펜슬 66노드가 전부 500). */
  keypad: { fontSize: 25, fontWeight: '500' },
  keypadSmall: { fontSize: 20, fontWeight: '500' },
  title3: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  title3Flat: { fontSize: 20, fontWeight: '800' },
  title3Soft: { fontSize: 20, fontWeight: '700' },
  headlineStrong: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4 },
  /** 다이얼로그 제목. 같은 16/800이지만 자간을 좁히지 않는다 (펜슬 DeleteConfirm). */
  headlineFlat: { fontSize: 16, fontWeight: '800' },
  headline: { fontSize: 16, fontWeight: '700' },
  subhead: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  subheadFlat: { fontSize: 15, fontWeight: '800' },
  subheadBold: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  /** 버튼 라벨. 같은 15/700이지만 자간을 좁히지 않는다 (펜슬 Button/Primary). */
  label: { fontSize: 15, fontWeight: '700' },
  subheadSoft: { fontSize: 15, fontWeight: '600' },
  bodyStrong: { fontSize: 14, fontWeight: '800', letterSpacing: -0.3 },
  bodyBold: { fontSize: 14, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '600' },
  /** 여러 줄로 흐르는 본문. 줄간격이 붙으면 축하 화면의 두 줄이 한 덩어리로 보인다. */
  bodyLead: { fontSize: 14, fontWeight: '600', lineHeight: 22 },
  bodySoft: { fontSize: 14, fontWeight: '500' },
  bodySoftLead: { fontSize: 14, fontWeight: '500', lineHeight: 21 },
  calloutStrong: { fontSize: 13, fontWeight: '800' },
  /** 자간을 벌린 소제목. 미션 완주 화면의 "미션 완주" 처럼 제목 위에 얹는 라벨. */
  overline: { fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  calloutBold: { fontSize: 13, fontWeight: '700' },
  callout: { fontSize: 13, fontWeight: '600' },
  calloutSoft: { fontSize: 13, fontWeight: '500' },
  calloutSoftLead: { fontSize: 13, fontWeight: '500', lineHeight: 20 },
  captionStrong: { fontSize: 12, fontWeight: '800' },
  caption: { fontSize: 12, fontWeight: '700' },
  captionSoft: { fontSize: 12, fontWeight: '600' },
  captionMuted: { fontSize: 12, fontWeight: '500' },
  captionMutedLead: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
  microBold: { fontSize: 11, fontWeight: '700' },
  micro: { fontSize: 11, fontWeight: '600' },
  microSoft: { fontSize: 11, fontWeight: '500' },
  nano: { fontSize: 10, fontWeight: '700' },
  nanoSoft: { fontSize: 10, fontWeight: '600' },
  /** 탭바 비활성 라벨. 활성(nano, 700)과 굵기로 갈린다 — 색만으로는 덜 읽힌다. */
  nanoMuted: { fontSize: 10, fontWeight: '500' },
} as const;

export type TypeName = keyof typeof type;

/** D24 — gap/padding 정규 값. */
export const space = {
  xxs: 3,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 14,
  '3xl': 16,
  '4xl': 20,
  '5xl': 24,
  '6xl': 28,
  '7xl': 32,
} as const;

/** D24 — radius 정규 값. */
export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 14,
  card: 16,
  '2xl': 18,
  '3xl': 20,
  '4xl': 24,
  '5xl': 30,
  '6xl': 34,
  pill: 999,
} as const;

/** 화면 좌우 기본 여백. 전 화면 공통. */
export const screenPadding = space['4xl'];

export const shadow = {
  card: {
    shadowColor: '#191F28',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#7C5CFF',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dialog: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
  /** 배경 위에 살짝 뜨는 작은 알약 (월 선택기·알림 버튼). */
  pill: {
    shadowColor: '#191F28',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  toast: {
    shadowColor: '#191F28',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;
