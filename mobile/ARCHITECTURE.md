# MoneyMinder Mobile — 아키텍처

## 왜 FSD 풀스펙이 아닌가

expo-router는 `src/app/` 디렉토리 구조가 곧 라우트라 FSD의 `pages` 레이어와 충돌한다.
7레이어(app/processes/pages/widgets/features/entities/shared)는 1인 프로젝트에서 보일러플레이트만
남기고 무너진다. 그래서 FSD의 **가치 두 개만** 가져왔다 — ① 의존성 단방향 ② 기능 단위 응집.

## 레이어

```
src/
  app/        expo-router 라우트. 화면 조립만 한다. 비즈니스 로직 금지.
  features/   기능 슬라이스. mission · recurring · record · payment-method · report
                model/  순수 도메인 로직 (테스트 100% 대상)
                ui/     이 기능 전용 컴포넌트
                api/    저장소 접근
                index.ts  public API — 외부는 여기로만 import
  entities/   여러 기능이 공유하는 도메인. transaction · category · budget
  shared/     theme(디자인 토큰) · ui(프리미티브) · lib(유틸)
```

의존 방향은 **`app → features → entities → shared`** 한 방향. features끼리 직접 import 금지 —
공유가 필요하면 `entities`로 내린다.

## 규칙은 린트가 강제한다

문서로만 있는 규칙은 반드시 깨진다. `eslint.config.js`가 두 가지를 막는다.

1. **레이어 위반** (`boundaries/dependencies`) — 역방향·횡단 import는 에러.
2. **디자인 토큰 이탈** — `fontSize: 13.5` 같은 숫자 리터럴, hex 직접 입력,
   `react-native`의 `Text` 직접 import 전부 에러. 펜슬에서 1,032개 노드까지 맞춘 스케일이
   코드에서 다시 새는 걸 막는 장치다. (DECISIONS D23/D24)

`shared/**`는 토큰을 정의하는 자리라 예외.

## 디자인 토큰

`src/shared/theme/tokens.ts` = 펜슬 `moneyminder.pen`의 코드 사본. **펜슬이 SSoT**이므로
값을 바꾸려면 펜슬 → 여기 순서다.

- `type` 11단계 (D23) — 자유 fontSize 금지. `<Text variant="body">` 로만 쓴다.
- `space` / `radius` (D24)
- `palette` light/dark

## 테스트

```
npm test           전체
npm run test:watch 감시
npm run typecheck  tsc --noEmit
```

- **도메인 로직이 1순위.** 무지출 판정·스트릭·고정지출 결제일 같은 규칙은 화면 없이 검증된다.
  날짜 경계(윤년, 말일 없는 달, 미래 날짜)가 버그가 숨는 자리라 케이스를 명시적으로 둔다.
- 커버리지 게이트 70% (`collectCoverageFrom`에서 `src/app/**` 제외 — 라우트는 조립만 하므로).
- 컴포넌트 테스트는 `@testing-library/react-native`, matcher는 v14 내장이라 별도 setup 불필요.

## 데이터

로컬 우선. `entities/*/store.ts`(zustand + AsyncStorage persist)에 저장하고,
서버 동기화는 나중에 `features/*/api/`에 remote 어댑터를 더하는 방식으로 얹는다.
스키마는 zod로 파싱해 저장 시점에 오염을 막는다.
