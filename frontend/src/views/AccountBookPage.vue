<template>
  <div class="account-book-page">
    <AccountBookLeftSidebar
        :selectedItem="selectedItem"
        @select="handleMenuSelect"
    />
    <div class="content">
      <component :is="currentComponent" />
    </div>

    <!-- 오른쪽 사이드바 컴포넌트 포함 -->
    <AccountBookRightSidebar />
  </div>
</template>

<script>
import AccountBookLeftSidebar from '@/components/accountBook/AccountBookLeftSidebar.vue';
import AccountBookRightSidebar from '@/components/accountBook/AccountBookRightSidebar.vue';
import AccountBookList from '@/components/accountBook/AccountBookList.vue';
import AccountBookForm from '@/components/accountBook/AccountBookForm.vue';

export default {
  components: {
    AccountBookLeftSidebar,
    AccountBookRightSidebar,  // 오른쪽 사이드바 컴포넌트 등록
    AccountBookList,
    AccountBookForm,
  },
  data() {
    return {
      selectedItem: 'transactionList',  // 기본 선택 항목
    };
  },
  computed: {
    currentComponent() {
      switch (this.selectedItem) {
        case 'transactionList':
          return 'AccountBookList';
        case 'transactionForm':
          return 'AccountBookForm';
        default:
          return 'AccountBookList';
      }
    },
  },
  methods: {
    handleMenuSelect(name) {
      this.selectedItem = name;
    },
  },
};
</script>

<style scoped>
.account-book-page {
  display: flex;
  position: relative; /* 오른쪽 사이드바를 위한 relative 위치 설정 */
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>