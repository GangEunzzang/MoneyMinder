import { NumText, Row, Stack } from 'moneyminder-mobile';

/** 숫자가 세로로 정렬돼야 하는 자리. tabular-nums 라 자릿수가 흔들리지 않는다. */
export const Amounts = () => (
  <Stack gap="sm">
    {['-6,100', '-63,000', '-1,550', '+2,600,000'].map((v) => (
      <Row key={v} between>
        <NumText variant="subheadBold">{v}</NumText>
      </Row>
    ))}
  </Stack>
);

/** 지출은 ink, 수입만 mintText — 부호가 아니라 의미로 색을 정한다. */
export const Signed = () => (
  <Row gap="xl">
    <NumText variant="subheadBold">-14,000</NumText>
    <NumText variant="subheadBold" color="mintText">+2,600,000</NumText>
  </Row>
);
