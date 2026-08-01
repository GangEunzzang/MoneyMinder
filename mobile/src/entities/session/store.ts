import { create } from 'zustand';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'offline';

type State = {
  status: ConnectionStatus;
  email: string | null;
  /** 실패 사유. 화면에 그대로 띄워 서버가 왜 안 붙는지 바로 보이게 한다. */
  error: string | null;
  syncedAt: string | null;
};

type Actions = {
  setConnecting: () => void;
  setConnected: (email: string, syncedAt: string) => void;
  setOffline: (error: string) => void;
};

/**
 * 서버 연결은 앱의 부가 상태다. 끊겨도 앱은 로컬 데이터로 계속 돌아가므로
 * persist 하지 않는다 — 다음 실행에서 다시 확인하는 게 맞다.
 */
export const useSession = create<State & Actions>()((set) => ({
  status: 'idle',
  email: null,
  error: null,
  syncedAt: null,

  setConnecting: () => set({ status: 'connecting', error: null }),
  setConnected: (email, syncedAt) => set({ status: 'connected', email, error: null, syncedAt }),
  setOffline: (error) => set({ status: 'offline', error }),
}));
