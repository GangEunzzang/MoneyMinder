import { AmountField } from 'moneyminder-mobile';

/** 기록 화면의 금액 입력. eyebrow 는 라벨이 아니라 말을 건다. */
export const Default = () => (
  <AmountField eyebrow="얼마를 쓰셨나요?" value="6100" onChange={() => {}} />
);

/** 아직 안 눌렀을 때 — 0 은 mist 로 물러난다. */
export const Empty = () => (
  <AmountField eyebrow="얼마를 쓰셨나요?" value="" onChange={() => {}} color="mist" />
);

/** 저장을 막은 이유를 eyebrow 자리에서 말한다. */
export const Error = () => (
  <AmountField
    eyebrow="금액을 입력해주세요"
    eyebrowColor="red"
    value=""
    onChange={() => {}}
    color="mist"
  />
);

/** 수입은 부호를 붙인다. */
export const Income = () => (
  <AmountField eyebrow="얼마를 받으셨나요?" value="2600000" sign="+" color="mintText" onChange={() => {}} />
);
