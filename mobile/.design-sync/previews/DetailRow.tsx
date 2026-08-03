import { Card, DetailRow } from 'moneyminder-mobile';

/** 읽으러 온 화면의 라벨-값 행 (14). 폼의 FieldRow(13) 와 크기가 다르다 — 다른 물건이다. */
export const Detail = () => (
  <Card list>
    <DetailRow label="카테고리" value="카페·간식" />
    <DetailRow label="날짜" value="7월 27일 월요일" divider />
    <DetailRow label="결제수단" value="신한체크" divider />
    <DetailRow label="메모" value="오후 미팅 커피" divider />
  </Card>
);
