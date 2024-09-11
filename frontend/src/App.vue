<template>
  <div id="app">
    <AppHeader /> <!-- 헤더는 여전히 고정됨 -->
    <router-view /> <!-- 라우팅된 페이지를 여기서 렌더링 -->
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,
  },
};
</script>

<style>
/* 필요에 따라 스타일을 유지 */
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
}
</style>
