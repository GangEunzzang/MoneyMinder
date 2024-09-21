<template>
  <div class="login-page">
    <div class="login-container">
      <h1>로그인</h1>
      <div class="button-container">
        <button @click="loginWithGoogle" class="btn btn-google">
          <img src="@/assets/googleLogo.png" alt="Google Logo" class="logo"> Google 로그인
        </button>
        <button @click="loginWithKakao" class="btn btn-kakao">
          <img src="@/assets/kakaoLogo.png" alt="Kakao Logo" class="logo"> Kakao 로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
      const frontendUrl = process.env.VUE_APP_FRONTEND_URL;
      window.location.href = `${apiBaseUrl}/oauth2/authorization/google?frontend_redirect_uri=${frontendUrl}/oauth2/callback`;
    },
    loginWithKakao() {
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
      const frontendUrl = process.env.VUE_APP_FRONTEND_URL;
      window.location.href = `${apiBaseUrl}/oauth2/authorization/kakao?frontend_redirect_uri=${frontendUrl}/oauth2/callback`;
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141418;
}

.login-container {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem 0;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  width: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s, transform 0.3s;
}

.btn img.logo {
  width: 29px;
  height: 29px;
}

.btn-google {
  border: 1px solid rgba(0, 0, 0, 0.13);
  background-color: #ffffff;
  color: #000000;
}

.btn-google:hover {
  transform: scale(1.02);
}

.btn-kakao {
  background-color: #eed44f;
  color: #3c1e1e;
}

.btn-kakao:hover {
  transform: scale(1.02);
}
</style>
