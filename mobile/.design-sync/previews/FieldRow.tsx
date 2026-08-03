import { Card, FieldRow } from 'moneyminder-mobile';

/** 폼의 라벨-값 행 (13). 값이 비면 "입력" 자리표시가 mist 로 뜬다. */
export const Form = () => (
  <Card list>
    <FieldRow label="이름" value="신한체크" />
    <FieldRow label="결제일" value="매월 25일" divider />
    <FieldRow label="메모" divider />
  </Card>
);
