import * as Haptics from 'expo-haptics';

/**
 * 손끝 피드백. 화면이 바뀌지 않는 동작(토글·선택)과 결과가 생기는 동작(저장·달성)에만 준다.
 * 스크롤·이동처럼 이미 시각 피드백이 충분한 곳에 넣으면 소음이 된다.
 */

/** 선택·토글. 가장 약하다. */
export function tapFeedback(): void {
  void Haptics.selectionAsync();
}

/** 저장·완료. 결과가 남는 동작. */
export function successFeedback(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** 삭제·실패. 되돌릴 수 없거나 뜻대로 안 된 동작. */
export function warningFeedback(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
