import { create } from 'zustand';

/** 읽고 사라지기까지. 짧으면 못 읽고, 길면 다음 동작을 가린다. */
const DURATION = 2000;

type State = { message: string | null };

const useToastStore = create<State>(() => ({ message: null }));

let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * 화면 어디서든 부른다. 저장하고 `router.back()` 하는 흐름이 많아 화면에 매달면
 * 토스트가 화면과 함께 사라진다 — 그래서 전역이다.
 */
export function toast(message: string): void {
  if (timer) clearTimeout(timer);

  useToastStore.setState({ message });
  timer = setTimeout(() => useToastStore.setState({ message: null }), DURATION);
}

export function useToastMessage(): string | null {
  return useToastStore((s) => s.message);
}
