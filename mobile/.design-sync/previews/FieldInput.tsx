import { Card, FieldInput, FieldRow } from 'moneyminder-mobile';

/** FieldRow 안에 들어가는 우측 정렬 입력. 라벨과 값이 한 줄에서 균형을 잡는다. */
export const InRow = () => (
  <Card list>
    <FieldRow label="이름" input={<FieldInput value="신한체크" onChangeText={() => {}} />} />
    <FieldRow
      label="메모"
      divider
      input={<FieldInput value="" placeholder="선택 입력" onChangeText={() => {}} />}
    />
  </Card>
);
