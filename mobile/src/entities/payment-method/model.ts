import { z } from 'zod';

import type { ColorName } from '@/shared/theme';

export const paymentKindSchema = z.enum(['card', 'cash', 'account']);
export type PaymentKind = z.infer<typeof paymentKindSchema>;

export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  kind: paymentKindSchema,
  /** palette 토큰 이름. 요약 스택바와 리스트 스와치가 같은 색을 쓴다. */
  color: z.string(),
  /** 신용카드만 결제일을 갖는다. 체크·현금·계좌는 null. */
  billingDay: z.number().int().min(1).max(31).nullable().default(null),
});

export type PaymentMethod = Omit<z.infer<typeof paymentMethodSchema>, 'color'> & { color: ColorName };

export const KIND_LABEL: Record<PaymentKind, string> = {
  card: '카드',
  cash: '현금',
  account: '계좌',
};

/** 목록을 "카드" / "현금·계좌" 두 묶음으로 가른다. */
export function isCard(pm: Pick<PaymentMethod, 'kind'>): boolean {
  return pm.kind === 'card';
}

export function describe(pm: PaymentMethod): string {
  if (pm.kind === 'card') {
    return pm.billingDay ? `신용 · 매월 ${pm.billingDay}일 결제` : '체크 · 결제 즉시 출금';
  }

  return pm.kind === 'account' ? '입출금 계좌' : '';
}

/**
 * "이번 달 카드 사용액" — 결제수단 화면의 핵심 숫자.
 * 타입이 card 인 수단의 합계만 센다 (현금·계좌 제외).
 */
export function cardSpend(methods: readonly PaymentMethod[], spendById: ReadonlyMap<string, number>): number {
  return methods.reduce((sum, pm) => (isCard(pm) ? sum + (spendById.get(pm.id) ?? 0) : sum), 0);
}

/** 스택바 세그먼트. 사용액 0인 수단은 빼서 바가 지저분해지지 않게 한다. */
export function stackSegments(
  methods: readonly PaymentMethod[],
  spendById: ReadonlyMap<string, number>,
): { id: string; color: ColorName; amount: number; ratio: number }[] {
  const rows = methods
    .map((pm) => ({ id: pm.id, color: pm.color, amount: spendById.get(pm.id) ?? 0 }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return rows.map((r) => ({ ...r, ratio: total > 0 ? r.amount / total : 0 }));
}
