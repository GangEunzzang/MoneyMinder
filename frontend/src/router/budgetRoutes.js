export const budgetRoutes = [
    {
        path: '/budget-management',
        name: 'budgetManagement',
        component: () => import('@/components/budget/BudgetManagement.vue'),
    },
    {
        path: '/budget-detail/:year/:month',
        name: 'budgetDetail',
        component: () => import('@/components/budget/BudgetDetail.vue'),
        props: true, // 동적 파라미터
    },
];
