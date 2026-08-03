# design-sync 노트 — MoneyMinder

## 이 레포는 변환기 표준 경로 밖이다

- `shared/ui` 는 **패키지가 아니라 Expo 앱 내부 폴더**다. `dist` · 빌드 스크립트 · package entry 가 없다.
- **React Native 컴포넌트**라 브라우저 렌더에 `react-native` → `react-native-web` 별칭이 필요하다.
  변환기는 이걸 모른다. 그래서 **ESM 번들을 먼저 직접 만들어** `--entry` 로 물린다.
- `react-native-web ~0.21` · `react-dom 19.2.3` 은 이미 설치돼 있다 (Expo web 설정도 `app.json` 에 있음).

## 스코프

**83개** — 컴포넌트 40 + 아이콘 43. 앱 배럴(`src/shared/ui/index.ts`)과 1:1 이다.

처음엔 25개만 올렸는데, Claude Design 에서 실제로 화면을 그려보니 디자인 에이전트가
**TabBar·ScreenHeader·Keypad 가 없다며 회색 사각형을 그렸다.** 셋 다 앱에는 있었다 —
내 배럴이 빠뜨린 것이었다. 확인해보니 15개 컴포넌트와 아이콘 43종이 통째로 빠져 있었다.

**교훈: 배럴은 `src/shared/ui/index.ts` 와 맞춘다.** 임의로 "핵심만" 고르면 그 판단이
디자인 에이전트의 한계가 된다.

## RN → 웹 번들: 다섯 개를 넘어야 했다 (2026-07-30, 전부 실측)

`.ds-src/build.mjs` 가 `dist/index.es.js` 를 만든다. 변환기는 이걸 `--entry` 로 받는다.

1. **깊은 경로 별칭 금지** — `react-native` → `react-native-web` 을 통째로 걸면
   `react-native/Libraries/Utilities/codegenNativeComponent` 같은 깊은 import 가 RNW 에 없어 터진다.
   정확히 `^react-native$` 만 바꾸고, `^react-native/` 는 스텁 네임스페이스로 보낸다.
2. **RNW 는 ESM 을 써야 한다** — `require.resolve('react-native-web')` 는 **CJS** 를 준다.
   CJS 는 동적 `require('react')` 를 써서 번들에서 `Dynamic require of "react" is not supported` 로 죽는다.
   `react-native-web/dist/index.js` 를 직접 가리킨다.
3. **RNW 에 없는 RN 표면을 채운다** — `react-native` 를 가상 모듈로 감싸 `TurboModuleRegistry`·
   `NativeModules`·`requireNativeComponent`·`UIManager` 를 stub 으로 더한다. 없으면 `react-native-svg`
   의 fabric 모듈이 import 단계에서 터진다. `export { default }` 는 넣지 말 것 — RNW ESM 에 default 가 없다.
4. **깊은 스텁의 default 는 함수여야 한다** — `codegenNativeComponent` 는 호출된다.
   `export default {}` 면 `codegenNativeComponent_default is not a function`.
5. **`.web.js` 확장자 우선 (제일 안 보이는 함정)** — `resolveExtensions` 에 `.web.*` 를 앞세우지 않으면
   `react-native-svg` 의 `./elements` 가 네이티브 구현으로 잡혀 `Svg`·`Path` 가 **null** 이 된다.
   증상은 **React #130** 이고, dist 의 export 는 24개 전부 정상이라 원인이 안 보인다.

### 폰트

`.ds-src/fonts/*.woff2` 는 `node_modules/@expo-google-fonts/noto-sans-kr/*/*.ttf` 를 woff2 로
변환한 **전체 자소** 판이다 (굵기당 ~540KB). 프로토타입(`design/build-prototype.py`)이 쓰는
서브셋과 달리 여기선 서브셋하지 않는다 — 디자인 에이전트는 어떤 글자든 쓸 수 있다.
레포에 커밋해 둔다: 새 클론에서 폰트 툴체인 없이 바로 재동기화되도록.

`@expo-google-fonts/*` 는 스텁하고 `.ttf` 는 `loader: 'empty'`.
안 그러면 4굵기 TTF 가 data URL 로 들어가 **번들이 75MB** 가 된다 (스텁 후 489KB).
웹 프리뷰의 폰트는 CSS `@font-face` 가 담당한다.

### 검증

`.ds-src/smoke/` 에 12개를 실제로 마운트해 브라우저 스크린샷으로 확인했다.
"빌드 통과"는 렌더 보장이 아니다 — 위 5번이 정확히 그 경우였다.

## 여섯 번째: RNW 의 style 태그가 검증기의 root 로 잡힌다 (2026-07-30)

프리뷰를 직접 쓴 순간 **25개 전부** `✗ [RENDER] root empty` 로 떨어졌다. 실제로는 다 렌더되고
있었다 — `texts` 에 내용이 있고 PNG 도 정상이었다.

원인: RNW 가 `<head>` 에 `<style id="react-native-stylesheet">` 를 심는데, 검증기의 마운트 셀렉터가
`document.querySelectorAll('#root, [id^="r"]')` 라 **이 style 태그가 첫 root 로 잡힌다.** RNW 는
`insertRule` (CSSOM) 로 규칙을 넣으므로 `textContent` 가 비어 있어 "빈 root" 판정.

`.ds-src/index.ts` 끝에서 로드 직후 id 를 `ds-rnw-stylesheet` 로 바꿔 해결. 배럴 본문은 import 평가
뒤에 돌므로 RNW 초기화 이후가 보장되고, `setTimeout(0)` 한 번을 덧대 지연 생성도 잡는다.

**RNW 를 쓰는 다른 레포도 같은 곳에서 막힌다.** 검증기 셀렉터는 `cfg` 오버라이드가 없다.

## 일곱 번째: `.d.ts` 를 안 내면 배럴을 넓혀도 카드가 안 는다 (2026-07-30)

변환기는 **컴포넌트 목록을 `.d.ts` 에서 읽는다** (`lib/source-kit.mjs`: "components =
PascalCase value exports in the .d.ts tree"). `dist/index.es.js` 만 다시 만들고
`dist/index.d.ts` 를 안 갱신하면 **번들엔 83개가 들었는데 카드는 25개** 로 나온다.

`.ds-src/build.mjs` 끝에 `tsc -p .ds-src/tsconfig.dts.json` 을 붙여 해결.
esbuild 와 tsc 를 따로 돌리면 반드시 어긋난다.

## 여덟 번째: 검증기의 `paints()` 가 SVG 를 못 본다 (2026-07-30)

`paints()` 는 `/^(IMG|SVG|CANVAS|...)$/` 로 `tagName` 을 검사하는데 **SVG 요소의
`tagName` 은 소문자 `svg`** 다 (HTML 요소만 대문자화된다). 그래서 배경 없는 순수
아이콘 43개가 전부 `[RENDER_THIN]` 으로 떨어진다. `CategoryIcon` 은 배경 tint 가 있어
통과했으므로 25개 시절엔 안 보였다.

아이콘 프리뷰에 캡션 한 줄(`22 · 28 · 36`)을 넣어 해결. 회피가 아니라 카드 정보량도 는다.

## ConfirmDialog 는 단일 카드다

`Modal` 이라 `position: fixed` 로 나가서 그리드 셀에 못 담긴다. 검증기가
`[GRID_OVERFLOW]` + 높이 0 `[RENDER_THIN]` 을 낸다. `cfg.overrides.ConfirmDialog` 에
`{cardMode: 'single', primaryStory: 'Danger'}` 를 두면 전자는 사라지고 **후자는 남는다 —
스크린샷으로 확인한 정상 렌더이므로 무시한다.**

## conventions.md 경로

`cfg.readmeHeader` 는 **config 홈**(= `.design-sync/` 의 부모, 여기선 `mobile/`) 기준이다.
`"conventions.md"` 로 적으면 `mobile/conventions.md` 를 찾아 조용히 skip 된다 —
`".design-sync/conventions.md"` 로 적어야 한다.

## Re-sync 위험

- **RN·RNW·react-native-svg 버전이 올라가면 위 5개가 다시 깨질 수 있다.** 특히 2·5번은
  패키지 내부 파일 배치에 의존한다 (`dist/index.js`, `lib/module/*.web.js`).
- `shared/ui` 에 **새 외부 의존**이 들어오면 스텁 목록(`expo-router`·`safe-area-context`)을 늘려야 한다.
- 번들은 `src/` 를 직접 읽는다. 앱 코드가 곧 디자인시스템 소스이므로 **앱 리팩토링이 곧 DS 변경**이다.
- 검증기가 갱신되면 위 여섯 번째(RNW style id) 가 불필요해지거나 **다른 곳에서 다시 걸릴 수 있다.**
  `[id^="r"]` 셀렉터가 살아 있는 한 shim 도 유지한다.
- 프리뷰(`.design-sync/previews/*.tsx`)는 **컴포넌트 API 를 그대로 문다.** props 이름을 바꾸면
  프리뷰가 조용히 깨지는 게 아니라 빌드가 터진다 — 그게 낫다. 바꿀 때 같이 고친다.
  단 **잘못된 값은 빌드를 통과한다.** `variant="muted"` (실제로는 `muted` boolean + variant
  `primary|secondary|danger`) 를 써서 `Cannot read properties of undefined (reading 'fg')`
  로 두 카드가 죽었다. 타입이 아니라 렌더가 잡아낸 케이스다.
- **아이콘 프리뷰 43개는 손으로 쓰지 않는다** — `icons.tsx` 에서 이름을 뽑아 템플릿으로 생성한다
  (NOTES 이 항목 아래 파이썬 한 토막이면 된다). 아이콘이 늘면 다시 돌린다.

## 펜슬 → Claude Design 파이프라인 (2026-07-31 확립)

Claude Design 프로젝트에 화면을 그릴 때 **손으로 명세를 쓰지 않는다.** 세 번 틀리고 나서 정한 절차다.

```
pencil export_html  →  design/extract-spec.py  →  프롬프트  →  Claude Design
                                                      ↑
                              conventions.md 의 "크기/굵기 → variant 조회표"
```

1. `mcp__pencil__export_html(nodeIds, format='html-css', outputPath)` 로 화면 묶음을 뽑는다.
2. `python3 design/extract-spec.py <export.html>` — 텍스트 계층 + **배경·라운드·점크기·글자크기/굵기·정렬**.
   `▪ [bg=peach r=999 dot5]` 처럼 **도형만 있는 요소도 남는다.** 이게 없으면
   "점 + 한 줄"과 "배경 박스 안의 한 줄"이 구분되지 않아 반드시 어긋난다.
3. 프롬프트에 그대로 넣는다. `▸` 줄바꿈 / `·` 같은 줄 / `|||` 화면 경계로 한 줄에 담는다
   (Claude Design 입력은 **개행이 곧 전송**이라 여러 줄을 못 쓴다).
4. 결과는 `DesignSync(get_file, projectId=<디자인 프로젝트>, path='<파일>.dc.html')` 로
   **직접 읽어 대조한다.** 스크린샷 눈대중은 variant 오선택을 절대 못 잡는다.

### 조회표가 핵심이다

펜슬은 `[14/700]` 처럼 픽셀/굵기로 말하고 DS 는 `bodyBold` 같은 이름으로 말한다.
둘을 잇는 표가 없으면 에이전트가 "가까워 보이는 것"을 고른다 — 13/500 에 `caption`(12/700),
20/800 에 `title2Flat`(26/800) 같은 식으로. 표는 `conventions.md` 에 있고 README 로 나간다.

**펜슬 조합 36종 중 31종이 DS 에 있다.** 없는 5종(52·60·64/800, 25/800, 11/800)은
공유 카드 전용 대형 숫자뿐이다.

### 주의

- Claude Design 이 Opus 로 과부하 나면 입력창의 **"Try again with Sonnet"** 으로 붙는다.
  이 작업 대부분이 Sonnet 으로 돌았고 명세가 정확하면 결과 차이는 크지 않았다.
- 브라우저에서 `javascript_tool` 은 차단된다. 렌더 텍스트 추출은 `get_file` 로 한다.
