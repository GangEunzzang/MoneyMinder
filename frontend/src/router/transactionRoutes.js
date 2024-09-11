export const transactionRoutes = [
    {
        path: '/transaction-list',
        name: 'transactionList',
        component: () => import('@/components/transaction/TransactionList.vue'),
    },
];
