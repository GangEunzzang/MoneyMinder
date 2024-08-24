
<template>
  <div id="app">
    <AppHeader />
    <div class="main-content">
      <router-view /> <!-- 라우팅된 컴포넌트를 여기에 렌더링 -->
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader
  },
};
</script>

<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

body {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif !important;
  margin: 0;
  padding: 0;
  height: 100%;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  margin: 0 auto 0 auto;
  width: 1000px;
  background-color: #ffffff;
}

</style>
