export const dashboardRoutes = [
    {
        path: '/monthly-view',
        name: 'monthlyView',
        component: () => import('@/components/dashboard/MonthlyView.vue'),
    },
];
