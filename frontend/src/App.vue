<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  components: {
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
  background-color: #111115;
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
