export const accountBookRoutes = [
  {
    path: '/account-book',
    component: () => import('@/views/AccountBookPage.vue'),
    children: [
      {
        path: 'transaction-list',
        name: 'transactionList',
        component: () => import('@/components/accountBook/transaction/TransactionList.vue'),
      },
      {
        path: 'monthly-view',
        name: 'monthlyView',
        component: () => import('@/components/accountBook/dashboard/MonthlyView.vue'),
      },
      {
        path: 'category-management',
        name: 'categoryManagement',
        component: () => import('@/components/accountBook/category/CategoryManagement.vue'),
      }
    ],
  },
];
