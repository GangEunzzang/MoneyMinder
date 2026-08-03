import { Card, CategoryIcon, ListRow } from 'moneyminder-mobile';

/** 내역·홈의 거래 행. leading 에 카테고리 배지가 들어간다. */
export const Transactions = () => (
  <Card list>
    {[
      { icon: 'cafe', tint: 'peach', soft: 'peachSoft', t: '스타벅스', s: '카페·간식 · 신한체크', v: '-6,100' },
      { icon: 'utensils', tint: 'violet', soft: 'violetSoft', t: '김밥천국', s: '식비 · 신한체크', v: '-8,500' },
      { icon: 'bus', tint: 'mint', soft: 'mintSoft', t: '지하철', s: '교통 · 현금', v: '-1,550' },
    ].map((r, i) => (
      <ListRow
        key={r.t}
        leading={<CategoryIcon icon={r.icon as any} tint={r.tint} tintSoft={r.soft} />}
        title={r.t}
        subtitle={r.s}
        value={r.v}
        divider={i > 0}
      />
    ))}
  </Card>
);

/** 상호가 없으면 카테고리가 제목으로 올라오고, 보조 줄에서는 빠진다. */
export const NoMerchant = () => (
  <Card list>
    <ListRow
      leading={<CategoryIcon icon="cafe" tint="peach" tintSoft="peachSoft" />}
      title="카페·간식"
      subtitle="신한체크"
      value="-5,800"
    />
  </Card>
);
