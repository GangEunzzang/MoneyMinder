<template>
  <header>
    <div class="nav-container">
      <div class="logo-container">
        <img id="logo" src="@/assets/logo.png" alt="Logo" />
      </div>
      <nav class="menu-container">
        <ul>
          <li><a href="#"><router-link to="/"> 홈</router-link></a></li>
          <li><a href="#"><router-link to="/account-book"> 가계부</router-link></a></li>
          <li><a href="#"><router-link to="/notification">알림</router-link></a></li>
          <li><a href="#" @click.prevent="showLoginModal"> 로그인</a></li>
          <li><a href="#"><router-link to="/my-page"> 마이페이지</router-link></a></li>
        </ul>
      </nav>
    </div>
    <login-modal v-if="isLoginModalVisible" @close="hideLoginModal"></login-modal>
  </header>
</template>

<script>
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
  methods: {
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
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-container {
  display: flex;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: 100%;
  margin: 0 30% 0 30% ;
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
  margin: 7px;
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
  padding: 7px 7px;
  user-select: none;
  font-size: 14px;
  display: block;
}


</style>
