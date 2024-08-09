<template>
  <div>
    <h1>로그인 완료</h1>
    <p>로그인이 완료되었습니다. 메인 페이지로 이동합니다...</p>
  </div>
</template>

<script>
export default {
  name: 'LoginCallback',
  beforeRouteEnter(to, from, next) {
    console.log("asdf");
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // 메인 페이지로 리디렉션
    next('/');
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
