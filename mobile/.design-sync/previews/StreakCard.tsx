import { StreakCard } from 'moneyminder-mobile';

/** 미션 탭의 히어로. 오늘 아직 인증을 안 했으면 하단에 풀바가 뜬다. */
export const CanVerify = () => (
  <StreakCard
    streak={12}
    longest={21}
    week={[true, true, true, true, true, false, false]}
    todayIndex={4}
    showVerify
    onVerify={() => {}}
  />
);

/** `onVerify` 가 없으면 누를 수 없는 상태 표시줄이 된다 — 이미 인증했거나 아직 이른 날. */
export const Verified = () => (
  <StreakCard
    streak={12}
    longest={21}
    week={[true, true, true, true, true, false, false]}
    todayIndex={4}
    showVerify
  />
);

/** 풀바 없이 기록만 보여주는 형태. */
export const Plain = () => (
  <StreakCard streak={5} longest={21} week={[false, true, true, true, true, true, false]} todayIndex={5} />
);
