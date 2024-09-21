import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Vuex store 불러오기
import HomePage from '@/views/HomePage.vue'; // 웹 소개 페이지
import LoginCallback from '@/views/LoginCallback.vue';
import LoginPage from '@/views/LoginPage.vue'; // 로그인 페이지
import AccountPage from '@/views/AccountPage.vue'; // 로그인 후 페이지

import { transactionRoutes } from './transactionRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { categoryRoutes } from './categoryRoutes';
import { budgetRoutes } from './budgetRoutes';

const routes = [
  { path: '/', component: HomePage },

  {
    path: '/account',
    component: AccountPage,
    children: [
      ...transactionRoutes,
      ...dashboardRoutes,
      ...categoryRoutes,
      ...budgetRoutes,
    ],
    meta: { requiresAuth: true }, // 인증이 필요한 경로에 추가
  },

  { path: '/login', component: LoginPage }, // 로그인 페이지
  { path: '/oauth2/callback', component: LoginCallback, props: true }, // OAuth 콜백 페이지
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 페이지 이동 전 로그인 여부 확인
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    // 로그인되지 않은 경우 로그인 페이지로 이동, 원래 가려던 경로는 쿼리로 저장
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next(); // 로그인되어 있으면 계속 진행
  }
});

export default router;
