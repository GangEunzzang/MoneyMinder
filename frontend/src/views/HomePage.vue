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
  background-color: #141418;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

</style>
