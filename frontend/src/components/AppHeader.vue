<template>
  <header>
    <div class="nav-container">
      <div class="logo-container">
        <img id="logo" src="@/assets/logo.png" alt="Logo" />
      </div>
      <nav class="menu-container">
        <ul>
          <li><router-link to="/"> 홈</router-link></li>
          <li><router-link to="/account-book"> 가계부</router-link></li>
          <li><router-link to="/notification">알림</router-link></li>
          <li v-if="!isLoggedIn"><a href="#" @click.prevent="showLoginModal"> 로그인</a></li>
          <li v-else><a href="#" @click.prevent="logout"> 로그아웃</a></li>
          <li><router-link to="/my-page"> 마이페이지</router-link></li>
        </ul>
      </nav>
    </div>
    <login-modal v-if="isLoginModalVisible" @close="hideLoginModal"></login-modal>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LoginModal from './LoginModal.vue';

export default {
  name: 'AppHeader',
  components: {
    LoginModal,
  },
  data() {
    return {
      isLoginModalVisible: false,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['logout']),
    showLoginModal() {
      this.isLoginModalVisible = true;
    },
    hideLoginModal() {
      this.isLoginModalVisible = false;
    },
  },
};
</script>

<style scoped>
header {
  background-color: #ffffff;
  color: white;
  position: sticky;
  border-bottom: 1px solid #e9ecef;
  width: 100%;
  height: 64px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 25% 0 18%;
}

#logo {
  width: 190px;
  height: 60px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.menu-container {
  display: flex;
  align-items: center;
}

.menu-container ul {
  display: flex;
  align-items: center;
  column-gap: 4px;
  margin: 0;
  padding: 0;
}

.menu-container ul li {
  margin: 5px;
  padding: 0;
  list-style: none;
}

.menu-container ul li:hover {
  background-color: rgba(199, 199, 199, 0.13);
  border-radius: 12px;
}

.menu-container ul li a {
  color: #495057;
  text-decoration: none;
  padding: 10px 14px;
  user-select: none;
  font-size: 14px;
  display: block;
  white-space: nowrap;
  transition: background-color 0.3s ease, color 0.3s ease; /* 부드러운 전환 */
}

/* 선택된 메뉴 스타일 */
.menu-container ul li .router-link-active {
  background-color: #f3f6ff;
  color: #425ad5;
  border-radius: 12px;
}

/* 선택된 메뉴에서의 hover 스타일 */
.menu-container ul li .router-link-active:hover {
  background-color: #e1e8ff; /* 배경색이 좀 더 진하게 */
  color: #2c3ebc; /* 글자색이 좀 더 진하게 */
}
</style>
