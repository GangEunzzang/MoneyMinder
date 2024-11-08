<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1>회원가입</h1>
      <div class="input-container">
        <input type="email" v-model="email" placeholder="이메일" class="input-field" />
        <input type="text" v-model="name" placeholder="이름" class="input-field" />
        <input type="password" v-model="password" placeholder="비밀번호" class="input-field" />
        <input type="password" v-model="passwordConfirm" placeholder="비밀번호 확인" class="input-field" />
        <button @click="signup" class="btn btn-signup">회원가입</button>
      </div>
      <div class="login-container">
        <p>이미 계정이 있으신가요? <a href="/login" class="login-link">로그인</a></p>
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
      name: '',
      password: '',
      passwordConfirm: '', // 비밀번호 확인 필드 추가
    };
  },
  methods: {
    signup() {
      // 비밀번호와 비밀번호 확인이 일치하는지 확인
      if (this.password !== this.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        return;
      }

      const signupData = {
        email: this.email,
        name: this.name,
        password: this.password,
      };
      UserAPI.signup(signupData)
          .then(response => {
            console.log('회원가입 성공:', response);
            // 회원가입 성공 후 알림 메시지를 띄우고 로그인 페이지로 이동
            alert('회원가입이 성공했습니다. 로그인해주세요.');
            this.$router.push('/login');
          })
          .catch(error => {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
          });
    },
  },
};
</script>

<style scoped>
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141418;
}

.signup-container {
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

.btn-signup {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem auto;
  cursor: pointer;
  font-size: 0.9rem;
  width: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 5px;
  background-color: #1e90ff;
  color: #ffffff;
  border: none;
  font-weight: bold;
}

.btn-signup:hover {
  background-color: #187bcd;
  transform: scale(1.01);
}

.login-container {
  margin-top: 1rem;
}

.login-link {
  color: #1e90ff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
