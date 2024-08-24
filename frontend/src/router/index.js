import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomePage.vue';
import MyPage from '@/views/MyPage.vue';
import Notification from '@/views/NotificationPage.vue';
import AccountBook from '@/views/AccountBookPage.vue';
import LoginCallback from '@/views/LoginCallback.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/my-page', component: MyPage },
    { path: '/notification', component: Notification },
    { path: '/account-book', component: AccountBook },
    {
        path: '/oauth2/callback',
        name: 'LoginCallback',
        component: LoginCallback,
        props: true
    } // 로그인 콜백 라우트
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
