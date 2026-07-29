import { txnMeta, txnTitle, type Transaction } from './model';

const base: Transaction = {
  id: 't1',
  type: 'expense',
  amount: 6100,
  categoryId: 'cafe',
  paymentMethodId: 'shinhan',
  merchant: '스타벅스',
  memo: '',
  date: '2026-08-06',
  autoRecorded: false,
};

describe('txnTitle / txnMeta', () => {
  it('상호가 있으면 카테고리는 보조 줄로 내려간다', () => {
    expect(txnTitle(base, '카페·간식')).toBe('스타벅스');
    expect(txnMeta(base, '카페·간식', '신한체크')).toBe('카페·간식 · 신한체크');
  });

  it('상호가 없으면 카테고리가 제목이 되고 보조 줄에서 빠진다', () => {
    const t = { ...base, merchant: '' };

    expect(txnTitle(t, '카페·간식')).toBe('카페·간식');
    expect(txnMeta(t, '카페·간식', '신한체크')).toBe('신한체크');
  });

  it('결제수단이 없으면 그 칸을 비운다', () => {
    expect(txnMeta({ ...base, paymentMethodId: null }, '카페·간식', null)).toBe('카페·간식');
  });

  it('자동기록은 맨 뒤에 붙는다', () => {
    expect(txnMeta({ ...base, autoRecorded: true }, '구독', '신한체크')).toBe(
      '구독 · 신한체크 · 자동기록',
    );
  });

  it('상호도 결제수단도 없으면 보조 줄이 빈다', () => {
    const t = { ...base, merchant: '', paymentMethodId: null };

    expect(txnMeta(t, '카페·간식', null)).toBe('');
  });
});
