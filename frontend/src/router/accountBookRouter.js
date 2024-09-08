export const accountBookRoutes = [
  {
    path: '/account-book',
    component: () => import('@/views/AccountBookPage.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/components/accountBook/DashBoard.vue'),
      },
      {
        path: 'transaction-list',
        name: 'transactionList',
        component: () => import('@/components/accountBook/TransactionList.vue'),
      },
      {
        path: 'monthly-view',
        name: 'monthlyView',
        component: () => import('@/components/accountBook/MonthlyView.vue'),
      },
      {
        path: 'category-management',
        name: 'categoryManagement',
        component: () => import('@/components/accountBook/CategoryManagement.vue'),
      }
    ],
  },
];
