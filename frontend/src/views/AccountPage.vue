<template>
  <div class="account-page">
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
.account-page {
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
