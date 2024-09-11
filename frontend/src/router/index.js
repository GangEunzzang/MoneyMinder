import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/HomePage.vue';
import LoginCallback from '@/views/LoginCallback.vue';
import {transactionRoutes} from './transactionRoutes';
import {dashboardRoutes} from './dashboardRoutes';
import {categoryRoutes} from './categoryRoutes';
import {budgetRoutes} from './budgetRoutes';

const routes = [
  {
    path: '/', component: Home,
    children: [
      ...transactionRoutes,
      ...dashboardRoutes,
      ...categoryRoutes,
      ...budgetRoutes,
    ],
  },
  {path: '/oauth2/callback', component: LoginCallback, props: true},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
