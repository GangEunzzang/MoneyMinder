import { Segmented, Stack } from 'moneyminder-mobile';

/** 기록 화면 상단. 보이는 높이는 38 이지만 hitSlop 으로 손가락에는 44 를 준다. */
export const ExpenseIncome = () => (
  <Segmented
    items={[
      { value: 'expense', label: '지출', color: 'red' },
      { value: 'income', label: '수입', color: 'mint' },
    ]}
    value="expense"
    onChange={() => {}}
    width={150}
  />
);

/** width 를 안 주면 부모를 채운다. */
export const FullWidth = () => (
  <Stack gap="md">
    <Segmented
      items={[
        { value: 'card', label: '카드' },
        { value: 'account', label: '계좌' },
        { value: 'etc', label: '페이·기타' },
      ]}
      value="card"
      onChange={() => {}}
    />
  </Stack>
);
