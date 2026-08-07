/**
 * 폰트 정본은 Pretendard 다 (D18). 펜슬은 Pretendard 를 지원하지 않아 Noto Sans KR 로
 * 근사해 그리지만, 코드는 정본을 싣는다.
 *
 * RN에서 커스텀 폰트는 fontWeight 로 굵기를 바꾸지 못한다 — 굵기마다 별개의
 * 패밀리를 실어야 한다. 그래서 타입 스케일의 fontWeight 를 패밀리 이름으로
 * 번역해서 쓴다.
 *
 * OTF 를 쓴다. 같은 자소 범위에서 TTF 보다 40% 작다 (6.0MB vs 10.7MB).
 */
export const fontAssets = {
  Pretendard_500Medium: require('../../../assets/fonts/Pretendard-Medium.otf'),
  Pretendard_600SemiBold: require('../../../assets/fonts/Pretendard-SemiBold.otf'),
  Pretendard_700Bold: require('../../../assets/fonts/Pretendard-Bold.otf'),
  Pretendard_800ExtraBold: require('../../../assets/fonts/Pretendard-ExtraBold.otf'),
};

const FAMILY: Record<string, string> = {
  '500': 'Pretendard_500Medium',
  '600': 'Pretendard_600SemiBold',
  '700': 'Pretendard_700Bold',
  '800': 'Pretendard_800ExtraBold',
};

export function fontFamilyFor(weight: string | number | undefined): string {
  return FAMILY[String(weight ?? '600')] ?? FAMILY['600'];
}
