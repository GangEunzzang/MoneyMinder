<template>
  <div class="home-page">
    <AppLeftSidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppLeftSidebar from '@/components/AppLeftSidebar.vue';

export default {
  components: {
    AppLeftSidebar,
  },
};
</script>

<style scoped>
.home-page {
  display: flex;
  height: 100%;
}

.content {
  flex: 1;
  background-color: #111115;
  min-height: 100vh; /* 화면 높이 100%로 설정 */
  overflow-y: auto; /* 내용이 많으면 세로 스크롤 */
  overflow-x: hidden; /* 좌우 스크롤 방지 */
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

</style>
