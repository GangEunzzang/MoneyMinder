import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { api } from '@/shared/lib/api';
import { persistStorage } from '@/shared/lib/storage';

import { type Category, findCategory, SEED_CATEGORIES } from './model';
import { toCategoryInput } from './serverAdapter';

/** 서버에 올라간 카테고리의 좌표. 수정·삭제는 id 로, 거래는 code 로 물고 간다. */
type ServerRef = { id: number; code: string };

type State = {
  categories: Category[];
  server: Record<string, ServerRef>;
};

type Actions = {
  add: (c: Omit<Category, 'id'>) => void;
  update: (id: string, patch: Partial<Omit<Category, 'id'>>) => void;
  /** 기록은 남기고 분류만 끊는다 — 과거 내역이 사라지면 가계부가 망가진다. */
  remove: (id: string) => void;
  linkServer: (map: Record<string, ServerRef>) => void;
};

let seq = 0;

function nextId(): string {
  seq += 1;

  return `c${Date.now().toString(36)}-${seq}`;
}

export const useCategoryStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      categories: [...SEED_CATEGORIES],
      server: {},

      add: (c) => {
        const local = { ...c, id: nextId() };
        set((s) => ({ categories: [...s.categories, local] }));

        api.categories
          .create(toCategoryInput(local))
          .then((saved) =>
            set((s) => ({
              server: {
                ...s.server,
                [local.id]: { id: saved.categoryId, code: saved.categoryCode },
              },
            })),
          )
          .catch(() => undefined);
      },

      update: (id, patch) => {
        const current = get().categories.find((c) => c.id === id);
        if (!current) return;

        const next = { ...current, ...patch };
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? next : c)) }));

        const ref = get().server[id];
        if (ref) api.categories.update(ref.id, toCategoryInput(next)).catch(() => undefined);
      },

      remove: (id) => {
        const ref = get().server[id];

        set((s) => {
          const server = { ...s.server };
          delete server[id];

          return { categories: s.categories.filter((c) => c.id !== id), server };
        });

        if (ref) api.categories.remove(ref.id).catch(() => undefined);
      },

      linkServer: (map) => set((s) => ({ server: { ...s.server, ...map } })),
    }),
    { name: 'moneyminder.categories.v1', storage: persistStorage },
  ),
);

export function useCategories(): Category[] {
  return useCategoryStore((s) => s.categories);
}

/** 화면 한 곳에서 카테고리 하나만 필요할 때. */
export function useCategory(id: string): Category {
  return useCategoryStore((s) => findCategory(s.categories, id));
}

export function serverCodeOf(categoryId: string): string | null {
  return useCategoryStore.getState().server[categoryId]?.code ?? null;
}

export function categoryIdOfCode(code: string): string | null {
  const found = Object.entries(useCategoryStore.getState().server).find(
    ([, ref]) => ref.code === code,
  );

  return found ? found[0] : null;
}
