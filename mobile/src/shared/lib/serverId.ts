/**
 * 서버에서 온 것은 id 가 숫자 문자열이다. 로컬에서 만든 것(`abc-1`)과 이걸로 가른다 —
 * 서버에 없는 행을 지우거나 고치려 들면 404 가 난다.
 */
export function toServerId(id: string): number | null {
  const parsed = Number(id);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
