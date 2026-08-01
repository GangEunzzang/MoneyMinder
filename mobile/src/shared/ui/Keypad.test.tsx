import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import { Keypad } from './Keypad';
import { Text } from './Text';

/** 키패드는 값을 그리지 않는다. 화면이 하듯 값을 옆에 띄워 눌린 결과를 읽는다. */
function Harness({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <Text>{`값:${value}`}</Text>
      <Keypad value={value} onChange={setValue} />
    </>
  );
}

async function tap(label: string) {
  await fireEvent.press(screen.getByLabelText(label));
}

describe('Keypad', () => {
  it('빈 값에서는 누른 숫자가 이어 붙는다', async () => {
    await render(<Harness initial="" />);

    await tap('6');
    await tap('1');
    await tap('00');

    expect(screen.getByText('값:6100')).toBeTruthy();
  });

  it('채워진 값을 고칠 때 첫 숫자는 이어 붙지 않고 갈아엎는다', async () => {
    await render(<Harness initial="17000" />);

    await tap('5');

    expect(screen.getByText('값:5')).toBeTruthy();
  });

  it('첫 숫자 이후로는 평범하게 이어 붙는다', async () => {
    await render(<Harness initial="17000" />);

    await tap('5');
    await tap('0');
    await tap('00');

    expect(screen.getByText('값:5000')).toBeTruthy();
  });

  it('지우기로 시작하면 기존 값을 이어서 고친다', async () => {
    await render(<Harness initial="17000" />);

    await tap('지우기');
    await tap('5');

    expect(screen.getByText('값:17005')).toBeTruthy();
  });
});
