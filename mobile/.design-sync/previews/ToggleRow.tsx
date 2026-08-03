import { Card, ToggleRow } from 'moneyminder-mobile';

/** 설정 목록의 스위치 행. hint 로 무엇이 켜지는지 한 줄 설명한다. */
export const Settings = () => (
  <Card list>
    <ToggleRow label="자동 기록" hint="결제일에 알아서 남겨요" on onChange={() => {}} />
    <ToggleRow label="사전 알림" hint="3일 전에 알려드려요" on={false} divider onChange={() => {}} />
  </Card>
);
