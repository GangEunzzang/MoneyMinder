<template>
  <div id="google-login">
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      const redirectUri = 'http://localhost:3000/haha';
      window.location.href = 'http://localhost:8080/oauth2/authorization/google?frontend_redirect_uri=' + redirectUri;
    }
  }
};
</script>

<style scoped>
/* 필요한 스타일을 여기에 추가할 수 있습니다 */
</style>
