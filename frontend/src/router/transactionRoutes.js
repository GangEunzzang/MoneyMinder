export const transactionRoutes = [
    {
        path: '/transaction',
        name: 'transaction',
        component: () => import('@/components/transaction/TransactionBasic.vue'),
    },
];
