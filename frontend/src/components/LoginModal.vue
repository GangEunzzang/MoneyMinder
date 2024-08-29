<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h1> 로그인</h1>
      <div class="button-container">
        <button @click="loginWithGoogle" class="btn btn-google">
          <img src="@/assets/googleLogo.png" alt="Google Logo" class="logo"> Google 로그인
        </button>
        <button @click="loginWithKakao" class="btn btn-kakao">
          <img src="@/assets/kakaoLogo.png" alt="Kakao Logo" class="logo"> Kakao 로그인
        </button>
        <button class="btn btn-close" @click="$emit('close')">닫기</button>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
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
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s, transform 0.3s;
}

.btn img.logo {
  width: 29px;
  height: 29px;
  margin-right: 0.5rem;
  left:0;
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

.btn-close {
  background-color: #999;
  color: white;
  margin-top: 1rem;
}

.btn-close:hover {
  background-color: #777;
  transform: scale(1.02);
}

</style>
