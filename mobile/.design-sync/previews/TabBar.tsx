import { TabBar } from 'moneyminder-mobile';

const routes = ['index', 'history', 'mission', 'settings'].map((name) => ({ key: name, name }));
const nav = { navigate: () => {} };

/** 하단 탭 4개 + 가운데 기록 FAB. 활성만 violet 이고 나머지는 smoke 다. */
export const Home = () => <TabBar state={{ index: 0, routes }} navigation={nav} />;

/** 어느 탭에 있는지는 색 하나로만 말한다 — 라벨 굵기는 바뀌지 않는다. */
export const History = () => <TabBar state={{ index: 1, routes }} navigation={nav} />;
