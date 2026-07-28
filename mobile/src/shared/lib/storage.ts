import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * 웹 프리렌더(`web.output: "static"`)에는 window가 없는데 AsyncStorage는 localStorage를
 * 곧바로 건드린다. 서버 패스에서는 메모리로 흘려보내고, 브라우저·네이티브에서만 실제로 쓴다.
 */
const memory = new Map<string, string>();

const canPersist = typeof window !== 'undefined';

const adapter = {
  getItem: (name: string) =>
    canPersist ? AsyncStorage.getItem(name) : Promise.resolve(memory.get(name) ?? null),
  setItem: (name: string, value: string) => {
    if (canPersist) return AsyncStorage.setItem(name, value);
    memory.set(name, value);

    return Promise.resolve();
  },
  removeItem: (name: string) => {
    if (canPersist) return AsyncStorage.removeItem(name);
    memory.delete(name);

    return Promise.resolve();
  },
};

/** 모든 persist 스토어가 공유하는 저장소. */
export const persistStorage = createJSONStorage(() => adapter);
