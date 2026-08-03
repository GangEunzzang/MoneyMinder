# MoneyMinder 디자인시스템

가계부 + 무지출 미션 앱. 화면은 **전부 이 컴포넌트들로만** 조립한다 — 새 화면이라고
색·간격·글자를 손으로 그리지 않는다. 손으로 그린 순간 같은 것이 화면마다 달라진다.

## 절대 규칙

1. **원시 스타일 금지.** `backgroundColor` · `padding` · `fontSize` 를 직접 쓰지 않는다.
   해당하는 컴포넌트가 이미 있다 — 없으면 컴포넌트를 먼저 만든다.
2. **보라 면은 `<HeroCard>`.** `violetFill` 을 배경으로 직접 칠하지 않는다.
   그 위의 글자·도트는 `onColor` / `color="onInk"` 로 명암을 뒤집는다.
3. **큰 금액은 `<AmountText>`.** 숫자와 단위(`원` `일째`)의 베이스라인을 맞춰주는 건
   이 컴포넌트뿐이다. `<NumText variant="display">` 로 흉내내지 않는다.
4. **금액에는 항상 천단위 구분.** `won()` 을 거친 문자열을 넣는다.

## 색이 말하는 것

색은 장식이 아니라 **의미**다. 같은 뜻에는 같은 색을 쓴다.

| 토큰 | 뜻 |
|---|---|
| `violet` / `violetFill` | 이 앱의 주인공 — 무지출·달성·활성 |
| `mintText` | 수입 · 아낀 돈 (초록을 글자로 쓸 땐 반드시 `mintText`, `mint` 는 대비 부족) |
| `red` / `redFill` | 예산 초과 · 삭제 · 되돌릴 수 없음 |
| `ink` / `smoke` / `mist` | 본문 / 보조 / 자리표시 |

**`dimmed` 는 "못 누름"이고 `danger` 는 "위험함"이다.** 회원 탈퇴를 흐리게 두면
못 누르는 줄로 읽힌다 — `danger` 를 쓴다.

## 조립 순서

```
Screen
 └ Stack gap="xl"          세로 리듬은 Stack 의 gap 이 만든다 (margin 금지)
    ├ SectionHeader        섹션 제목 + 우측 액션
    ├ Card                 흰 면. list 를 주면 안쪽 여백을 행이 갖는다
    │   └ ListRow ×N       divider 는 첫 행 빼고 준다
    └ HeroCard             보라 면. 화면당 하나
```

- `Row` / `Stack` 의 `gap` 만으로 간격을 만든다. 컴포넌트에 margin 을 붙이지 않는다.
- 목록 카드는 `<Card list>` — 행이 카드 가장자리까지 닿아야 눌리는 면이 넓어진다.
- 라벨-값 행은 **읽는 화면이면 `DetailRow`, 고치는 화면이면 `FieldRow`** 다. 크기가 다르다.

## 시안의 `크기/굵기` → `variant` 조회표

시안 명세는 `[14/700 ink]` 처럼 **픽셀/굵기**로 온다. 눈대중으로 가까운 variant 를 고르지 말고
이 표에서 정확히 찾는다 — 13/500 을 `caption`(12/700)으로 고르는 실수가 실제로 났다.

| 시안 | variant | | 시안 | variant |
|---|---|---|---|---|
| 38/800 | `display` | | 14/800 | `bodyStrong` |
| 32/800 | `title1` | | 14/700 | `bodyBold` |
| 26/800 | `title2Flat` | | 14/600 | `body` |
| 26/700 | `title2Light` | | 14/500 | `bodySoftLead` |
| 25/500 | `keypad` | | 13/800 | `calloutStrong` |
| 20/800 | `title3` | | 13/700 | `calloutBold` |
| 20/700 | `title3Soft` | | 13/600 | `callout` |
| 20/500 | `keypadSmall` | | 13/500 | `calloutSoftLead` |
| 16/800 | `headlineStrong` | | 12/800 | `captionStrong` |
| 16/700 | `headline` | | 12/700 | `caption` |
| 15/800 | `subhead` | | 12/600 | `captionSoft` |
| 15/700 | `subheadBold` | | 12/500 | `captionMutedLead` |
| 15/600 | `subheadSoft` | | 11/700 | `microBold` |
| 11/600 | `micro` | | 11/500 | `microSoft` |
| 10/700 | `nano` | | 10/600 | `nanoSoft` |
| 10/500 | `nanoMuted` | | | |

**표에 없는 크기**(52·60·64/800, 25/800, 11/800)는 공유 카드 전용 대형 숫자다.
이때만 `dc-props` 로 직접 지정하고, 그 외에는 절대 임의 크기를 쓰지 않는다.

## 화면 틀 — 세 종류뿐이다

| 화면 | 상단 | 하단 |
|---|---|---|
| **탭 루트** (홈·내역·미션·전체) | **`ScreenHeader` 를 쓰지 않는다.** 인사말·제목을 `Row between center` 로 직접 놓는다 — 돌아갈 곳이 없으니 뒤로가기가 없다 | `TabBar` |
| **밀어 올린 화면** (거래 상세·예산·고정 지출·카테고리) | `ScreenHeader title` — 뒤로가기가 여기 하나뿐이다 | 없음 (필요하면 `Spring` + `Button`) |
| **기록 추가** | 닫기 **X** + `Segmented`(지출/수입). 제목도 뒤로가기도 없다 | `Keypad` → **그 아래** 저장 `Button` |

**탭 루트에 `ScreenHeader` 를 붙이면 안 된다.** 뒤로가기 화살표가 생기는데 갈 곳이 없다.

## 문장

라벨이 아니라 **말을 건다**. `금액` 이 아니라 `얼마를 쓰셨나요?`,
`0건` 이 아니라 `아직 기록이 없어요`. 숫자 뒤 단위는 작게 (`12일째` 의 `일째`).

## 진실 소스

시안은 펜슬(`design/moneyminder.pen`)이고 코드는 `mobile/src/shared/ui/`.
둘이 다르면 **펜슬이 이긴다** — 단 이 카드들에 보이는 렌더는 전부 실제 코드다.
