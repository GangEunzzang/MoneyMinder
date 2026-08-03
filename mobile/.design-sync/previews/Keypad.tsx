import { AmountField, Keypad, Stack } from 'moneyminder-mobile';

/** 기록·예산 화면의 숫자 입력. 시스템 키보드를 안 쓰는 이유는 금액 말고는 칠 게 없어서다. */
export const Default = () => <Keypad value="6100" onChange={() => {}} />;

/** 실제로는 항상 AmountField 와 한 화면에 있다. 위가 결과, 아래가 손. */
export const WithAmount = () => (
  <Stack gap="4xl">
    <AmountField eyebrow="얼마를 쓰셨나요?" value="6100" onChange={() => {}} />
    <Keypad value="6100" onChange={() => {}} />
  </Stack>
);
