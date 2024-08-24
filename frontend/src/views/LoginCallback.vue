<template>
  <div>
    <h1>로그인 완료</h1>
    <p>로그인이 완료되었습니다. 메인 페이지로 이동합니다...</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginCallback',
  async beforeRouteEnter(to, from, next) {
    next(vm => vm.handleLogin());
  },
  methods: {
    ...mapActions(['saveTokens', 'logout']),
    async handleLogin() {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken) {
        await this.saveTokens({ accessToken, refreshToken });
        this.$router.push('/');
      } else {
        this.logout();
        this.$router.push('/login'); // 에러 발생 시 로그인 페이지로 리다이렉트
      }
    },
  },
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
