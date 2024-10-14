<template>
  <div class="login-page">
    <div class="login-container">
      <h1>로그인</h1>
      <div class="input-container">
        <input type="email" v-model="email" placeholder="이메일" class="input-field" />
        <input type="password" v-model="password" placeholder="비밀번호" class="input-field" />
        <button @click="validateAndLogin" class="btn btn-login">로그인</button>
      </div>

      <div class="button-container">
        <button @click="loginWithGoogle" class="btn btn-google">
          <img src="@/assets/googleLogo.png" alt="Google Logo" class="logo"> 구글로 시작하기
        </button>
        <button @click="loginWithNaver" class="btn btn-naver">
          <img src="@/assets/naverLogo.png" alt="Naver Logo" class="logo"> 네이버로 시작하기
        </button>
      </div>
      <div class="signup-container">
        <p>계정이 없으신가요? <a href="/signup" class="signup-link">회원가입</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import UserAPI from '@/api/user';
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    validateAndLogin() {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert('유효한 이메일 형식을 입력해주세요.');
        return;
      }
      // 로그인 로직 실행
      this.login();
    },
    login() {
      const loginData = {
        email: this.email,
        password: this.password,
      };
      UserAPI.login(loginData)
          .then(response => {
            const redirectUrl = `${process.env.VUE_APP_FRONTEND_URL}/oauth2/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`;
            window.location.href = redirectUrl;
          })
          .catch(error => {
            console.error('로그인 실패:', error);
            alert('로그인에 실패하였습니다. 다시 시도해주세요.');
          });
    },
    loginWithGoogle() {
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
      const frontendUrl = process.env.VUE_APP_FRONTEND_URL;
      window.location.href = `${apiBaseUrl}/oauth2/authorization/google?frontend_redirect_uri=${frontendUrl}/oauth2/callback`;
    },
    loginWithNaver() {
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
      const frontendUrl = process.env.VUE_APP_FRONTEND_URL;
      window.location.href = `${apiBaseUrl}/oauth2/authorization/naver?frontend_redirect_uri=${frontendUrl}/oauth2/callback`;
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
  width: 360px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-field {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #1e90ff;
  outline: none;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem 0;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  width: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 5px;
}

.btn-google {
  border: 1px solid rgba(0, 0, 0, 0.13);
  background-color: #ffffff;
  color: #000000;
}

.btn-google:hover {
  transform: scale(1.01);
}

.btn-google img.logo {
  width: 22px;
  height: 22px;
}

.btn-naver {
  background-color: #1ec800;
  color: #ffffff;
}

.btn-naver:hover {
  transform: scale(1.01);
}

.btn-naver img.logo {
  width: 24px;
  height: 24px;
}

.btn-login {
  background-color: #1e90ff;
  color: #ffffff;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin: 10px auto;
}

.btn-login:hover {
  background-color: #187bcd;
  transform: scale(1.01);
}

.signup-container {
  margin-top: 1rem;
}

.signup-link {
  color: #1e90ff;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>