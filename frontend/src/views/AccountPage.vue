<template>
  <div class="account-page">
    <!-- 헤더 -->

    <!-- 메인 컨텐츠 -->
    <div class="main-container">
      <AppLeftSidebar />
      <CommonHeader/>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AppLeftSidebar from '@/components/AppLeftSidebar.vue';
import CommonHeader from "@/components/CommonHeader.vue";

export default {
  components: {
    AppLeftSidebar,
    CommonHeader
  },
};
</script>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
}

.content {
  background-color: #141418;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-left: 10rem;
}
</style>
