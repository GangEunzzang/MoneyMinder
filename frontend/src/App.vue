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
body {
  font-family: Pretendard,-apple-system,BlinkMacSystemFont,system-ui,Roboto,Helvetica Neue,Segoe UI,Apple SD Gothic Neo,Noto Sans KR,Malgun Gothic,sans-serif!important;
}

html {
  font-family: Pretendard,-apple-system,BlinkMacSystemFont,system-ui,Roboto,Helvetica Neue,Segoe UI,Apple SD Gothic Neo,Noto Sans KR,Malgun Gothic,sans-serif!important;
}

.main-content {
  display: flex;
  flex: 1;
  background-color: #f0f2f5;
}
.content {
  flex: 1;
  background-color: #ffffff;
}


</style>
