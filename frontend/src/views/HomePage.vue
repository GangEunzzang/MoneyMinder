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
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
}
</style>
