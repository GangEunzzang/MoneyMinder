// router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomePage.vue';
import MyPage from '@/views/MyPage.vue';
import Notification from '@/views/NotificationPage.vue';
import LoginCallback from '@/views/LoginCallback.vue';
import { accountBookRoutes } from './accountBookRouter'; // accountBookRouter에서 routes 가져옴

const routes = [
    { path: '/', component: Home }, // 기본 라우터
    { path: '/my-page', component: MyPage }, // 마이페이지
    { path: '/notification', component: Notification }, // 알림 페이지
    { path: '/oauth2/callback', component: LoginCallback, props: true }, // 로그인 콜백
    ...accountBookRoutes, // 가계부 라우터 통합
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
