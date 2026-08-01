import type { ColorName } from '@/shared/theme';

export type MissionId =
  | 'no-spend'
  | 'cafe-diet'
  | 'budget-keep'
  | 'delivery-cut'
  | 'fixed-cost'
  | 'daily-budget';

/** 목표를 무엇으로 세느냐 — 화면이 "3/5잔" 인지 "3/4일" 인지를 이걸로 정한다. */
export type MissionUnit = 'day' | 'count' | 'won';

export type MissionSpec = {
  id: MissionId;
  title: string;
  /** 목록에서 보이는 한 줄. 무엇을 세는지 말한다. */
  summary: string;
  /** 설정 화면에서 목표를 묻는 말. */
  question: string;
  unit: MissionUnit;
  unitLabel: string;
  /** 이 미션이 세는 카테고리. null 이면 전체 지출. */
  categoryId: string | null;
  defaultTarget: number;
  targetChoices: readonly number[];
  tint: ColorName;
  tintSoft: ColorName;
};

export const MISSIONS: readonly MissionSpec[] = [
  {
    id: 'no-spend',
    title: '무지출 챌린지',
    summary: '일주일에 며칠은 한 푼도 안 쓰기',
    question: '일주일에 며칠 도전할까요?',
    unit: 'day',
    unitLabel: '일',
    categoryId: null,
    defaultTarget: 4,
    targetChoices: [2, 3, 4, 5, 6, 7],
    tint: 'violet',
    tintSoft: 'violetSoft',
  },
  {
    id: 'cafe-diet',
    title: '카페 다이어트',
    summary: '카페·간식 결제 횟수를 세요',
    question: '일주일에 몇 잔까지?',
    unit: 'count',
    unitLabel: '잔',
    categoryId: 'cafe',
    defaultTarget: 5,
    targetChoices: [2, 3, 4, 5, 7, 10],
    tint: 'peach',
    tintSoft: 'peachSoft',
  },
  {
    id: 'budget-keep',
    title: '예산 지키기',
    summary: '이번 달 예산 안에서 끝내기',
    question: '이번 달 예산은?',
    unit: 'won',
    unitLabel: '원',
    categoryId: null,
    defaultTarget: 1_200_000,
    targetChoices: [800_000, 1_000_000, 1_200_000, 1_500_000],
    tint: 'mint',
    tintSoft: 'mintSoft',
  },
  {
    id: 'delivery-cut',
    title: '배달 줄이기',
    summary: '주 몇 번까지만 시켜먹기',
    question: '일주일에 몇 번까지?',
    unit: 'count',
    unitLabel: '번',
    categoryId: 'food',
    defaultTarget: 2,
    targetChoices: [1, 2, 3, 4],
    tint: 'red',
    tintSoft: 'redSoft',
  },
  {
    id: 'fixed-cost',
    title: '고정비 다이어트',
    summary: '안 쓰는 구독 하나 해지하기',
    question: '고정 지출을 얼마까지 줄일까요?',
    unit: 'won',
    unitLabel: '원',
    categoryId: 'subscription',
    defaultTarget: 100_000,
    targetChoices: [50_000, 100_000, 150_000, 200_000],
    tint: 'violetDeep',
    tintSoft: 'violetSoft',
  },
  {
    id: 'daily-budget',
    title: '하루 예산 지키기',
    summary: '하루에 정한 금액 이하로 쓰기',
    question: '하루에 얼마까지?',
    unit: 'won',
    unitLabel: '원',
    categoryId: null,
    defaultTarget: 10_000,
    targetChoices: [5_000, 10_000, 15_000, 20_000, 30_000],
    tint: 'mint',
    tintSoft: 'mintSoft',
  },
] as const;

const BY_ID = new Map(MISSIONS.map((m) => [m.id, m]));

export function findMission(id: string): MissionSpec | undefined {
  return BY_ID.get(id as MissionId);
}

export type MissionPeriod = 'week' | 'month' | 'forever';

export const PERIOD_LABEL: Record<MissionPeriod, string> = {
  week: '이번 주',
  month: '이번 달',
  forever: '계속',
};

export type ActiveMission = {
  id: MissionId;
  target: number;
  period: MissionPeriod;
  /** YYYY-MM-DD */
  startedOn: string;
};

/** 목표 표기. 금액이면 "만원" 단위로 접어 목록이 숫자로 뒤덮이지 않게 한다. */
export function targetLabel(spec: MissionSpec, target: number): string {
  if (spec.unit !== 'won') return `${target}${spec.unitLabel}`;
  if (target >= 10_000) return `${target / 10_000}만원`;

  return `${target.toLocaleString('ko-KR')}원`;
}
