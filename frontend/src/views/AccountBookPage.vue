<template>
  <div class="account-book-page">
    <AccountBookLeftSidebar
        :selectedItem="selectedItem"
        @select="handleMenuSelect"
    />
    <div class="content">
      <router-view /> <!-- 가운데 컨텐츠가 변경되는 부분 -->
    </div>
    <AccountBookRightSidebar />
  </div>
</template>

<script>
import AccountBookLeftSidebar from '@/components/accountBook/AccountBookLeftSidebar.vue';
import AccountBookRightSidebar from '@/components/accountBook/AccountBookRightSidebar.vue';

export default {
  components: {
    AccountBookLeftSidebar,
    AccountBookRightSidebar,
  },
  data() {
    return {
      selectedItem: 'transactionList',  // 기본 선택 항목
    };
  },
  methods: {
    handleMenuSelect(name) {
      this.selectedItem = name;
      this.$router.push({ name: name }); // 라우터를 통해 페이지 이동
    },
  },
};
</script>

<style scoped>
.account-book-page {
  display: flex;
  position: relative;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>
