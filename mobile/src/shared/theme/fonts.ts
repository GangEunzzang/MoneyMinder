import {
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
  NotoSansKR_800ExtraBold,
} from '@expo-google-fonts/noto-sans-kr';

/**
 * 펜슬 문서의 `font` 변수가 Noto Sans KR 이다.
 *
 * RN에서 커스텀 폰트는 fontWeight 로 굵기를 바꾸지 못한다 — 굵기마다 별개의
 * 패밀리를 실어야 한다. 그래서 타입 스케일의 fontWeight 를 패밀리 이름으로
 * 번역해서 쓴다.
 */
export const fontAssets = {
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
  NotoSansKR_800ExtraBold,
};

const FAMILY: Record<string, string> = {
  '500': 'NotoSansKR_500Medium',
  '600': 'NotoSansKR_600SemiBold',
  '700': 'NotoSansKR_700Bold',
  '800': 'NotoSansKR_800ExtraBold',
};

export function fontFamilyFor(weight: string | number | undefined): string {
  return FAMILY[String(weight ?? '600')] ?? FAMILY['600'];
}
