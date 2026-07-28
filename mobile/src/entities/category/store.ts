import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/shared/lib/storage';

import { type Category, findCategory, SEED_CATEGORIES } from './model';

type State = { categories: Category[] };

type Actions = {
  add: (c: Omit<Category, 'id'>) => void;
  update: (id: string, patch: Partial<Omit<Category, 'id'>>) => void;
  /** 기록은 남기고 분류만 끊는다 — 과거 내역이 사라지면 가계부가 망가진다. */
  remove: (id: string) => void;
};

let seq = 0;

function nextId(): string {
  seq += 1;

  return `c${Date.now().toString(36)}-${seq}`;
}

export const useCategoryStore = create<State & Actions>()(
  persist(
    (set) => ({
      categories: [...SEED_CATEGORIES],
      add: (c) => set((s) => ({ categories: [...s.categories, { ...c, id: nextId() }] })),
      update: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      remove: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
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
