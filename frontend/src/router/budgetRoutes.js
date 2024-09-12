export const budgetRoutes = [
    {
        path: '/budget',
        name: 'budget',
        component: () => import('@/components/budget/BudgetBasic.vue'),
    },
    {
        path: '/budget-detail/:year/:month',
        name: 'budgetDetail',
        component: () => import('@/components/budget/BudgetDetail.vue'),
        props: true, // 동적 파라미터
    },
];
