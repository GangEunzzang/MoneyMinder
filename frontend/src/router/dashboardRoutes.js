export const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/components/dashboard/DashboardBasic.vue'),
    },
];
