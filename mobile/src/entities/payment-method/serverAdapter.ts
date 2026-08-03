import type { PaymentMethod } from '@/entities/payment-method/model';
import type { ServerPaymentMethod } from '@/shared/lib/api';
import type { ColorName } from '@/shared/theme';

const KIND_COLOR: Record<string, ColorName> = {
  CARD: 'violet',
  CASH: 'mint',
  ACCOUNT: 'peach',
};

export function toAppPaymentMethod(server: ServerPaymentMethod): PaymentMethod {
  return {
    id: String(server.paymentMethodId),
    name: server.name,
    kind: server.kind.toLowerCase() as PaymentMethod['kind'],
    color: (server.color as ColorName) ?? KIND_COLOR[server.kind] ?? 'violet',
    billingDay: server.billingDay,
  };
}
