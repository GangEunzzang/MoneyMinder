import { PayChip, Row } from 'moneyminder-mobile';

/** 결제수단 선택. Chip 보다 4pt 높고 아이콘을 받는다. */
export const Methods = () => (
  <Row gap="md" style={{ flexWrap: 'wrap', rowGap: 8 }}>
    <PayChip label="신한체크" icon={null} selected onPress={() => {}} />
    <PayChip label="국민카드" icon={null} onPress={() => {}} />
    <PayChip label="카카오뱅크" icon={null} onPress={() => {}} />
    <PayChip label="현금" icon={null} onPress={() => {}} />
  </Row>
);
