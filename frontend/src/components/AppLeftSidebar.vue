<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- 사이드바 열고 닫는 토글 버튼 -->
    <div class="toggle-container" @click="toggleSidebar">
      <div :class="['toggle-button', { 'on': isCollapsed }]">
        <div class="toggle-circle">
          <div class="small-circle"></div> <!-- 작은 원 추가 -->
        </div>
      </div>
    </div>

    <!-- 사이드바 메뉴 -->
    <ul class="main-menu">
      <!-- 대메뉴 항목 -->
      <li class="main-menu-li"
          v-for="item in menuItems"
          :key="item.name"
          :class="{ active: isMenuActive(item), collapsed: isCollapsed }"
          @mouseover="hoverMenu(item.name)"
          @mouseleave="hoverMenu(null)"
      >
        <router-link :to="item.route" class="menu-item">
          <font-awesome-icon :icon="item.icon" class="icon"/>
          <!-- 라벨을 전부 펼쳐진 상태일 때만 노출 -->
          <span v-if="showLabels" class="label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <div class="auth-section">
      <a v-if="!isLoggedIn" href="#" @click.prevent="showLoginModal" class="auth-link">
        <font-awesome-icon icon="sign-in-alt" class="icon" />
        <span v-if="showLabels" class="label">로그인</span>
      </a>
      <a v-else href="#" @click.prevent="logout" class="auth-link">
        <font-awesome-icon icon="sign-out-alt" class="icon" />
        <span v-if="showLabels" class="label">로그아웃</span>
      </a>
    </div>
    <login-modal v-if="LoginModal" @close="closeLoginModal"></login-modal>

  </div>
</template>

<script>
import LoginModal from './LoginModal.vue';
export default {
  components: {
    LoginModal,
  },

  props: {
    selectedItem: String, // 부모로부터 현재 선택된 항목을 받아옴
  },
  data() {
    return {
      isCollapsed: false, // 사이드바 토글 상태
      showLabels: true, // 라벨 표시 여부
      hoveredMenu: null, // 호버된 대메뉴 상태
      LoginModal: false, // 로그인 모달 표시 여부
      menuItems: [
        {
          name: 'Dashboard',
          label: '대시보드',
          icon: 'home',
          route: '/dashboard',
        },
        {
          name: 'transactions',
          label: '거래내역',
          icon: 'wallet',
          route: '/transaction'
        },
        {
          name: 'categories',
          label: '카테고리',
          icon: 'folder-open',
          route: '/category',
        },
        {
          name: 'budget',
          label: '예산',
          icon: 'money-bill-wave',
          route: '/budget',
        },
      ],
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed; // 토글 상태 전환
      this.showLabels = false; // 토글 중에는 라벨 숨김

      if (this.isCollapsed) {
        this.menuItems.forEach(item => item.isOpen = false);
      }

      // 트랜지션 후에 라벨을 보여줌
      setTimeout(() => {
        if (!this.isCollapsed) {
          this.showLabels = true; // 펼쳐진 후에 라벨을 다시 보여줌
        }
      }, 400); // 트랜지션 시간과 맞춰 설정
    },
    hoverMenu(name) {
      this.hoveredMenu = name; // 현재 호버된 대메뉴 저장
    },
    isMenuActive(item) {
      // 대메뉴가 active인지 확인 (현재 페이지의 경로와 맞는지 체크)
      return this.$route.path === item.route;
    },

    showLoginModal() {
      this.LoginModal = true;
    },

    closeLoginModal() {
      this.LoginModal = false;
    },

    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 12rem;
  min-height: 100vh;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: width 0.3s ease, padding 0.3s ease;
  position: sticky;
  left: 0;
  overflow: clip;
  background-color: #25252b;
  z-index: 10001;
}

a {
  text-decoration: none;
  color: inherit;
}

.sidebar.collapsed {
  width: 60px;
  padding: 15px 5px;
}

.sidebar.collapsed li {
  width: 1rem;
  margin: 30px auto;
}

.sidebar.collapsed ul {
  margin-top: 60px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 15px;
  width: 110%;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, border-radius 0.3s ease;
  margin: 20px 0;
  white-space: nowrap;
  border-radius: 17px;
}

.icon {
  font-size: 1.1em;
  margin-right: 10px;
  color: white;
  transition: color 0.3s ease;
}

.label {
  white-space: nowrap;
  font-size: 0.9rem;
  color: #989898;
  font-weight: 500;
  transition: color 0.3s ease;
}

.main-menu {
  margin-top: 5rem;
}

/* 대메뉴 active 상태 스타일 */
.main-menu-li.active {
  background-color: #7f6df4;
  border-radius: 17px;
  font-weight: 700;
}


.main-menu-li:hover {
  background-color: rgba(147, 138, 236, 0.8);
  border-radius: 17px;
  color: white;
}

.main-menu-li:hover .icon {
  color: #fff;
}

.main-menu-li:hover .label {
  color: #fff;
}

.main-menu-li.active:hover {
  background-color: #715cf8;
  color: white;
  font-weight: bold;
}

.main-menu-li:not(.collapsed):hover {
  transform: translateX(5px); /* 접혀있지 않을 때만 적용 */
}

.main-menu-li.collapsed {
  transform: none; /* 접혀있을 때는 앞으로 밀리지 않음 */
}

.sidebar li.active .icon, .sidebar li.active .label {
  color: white;
}

.main-menu-li:not(.collapsed):hover {
  transform: translateX(5px); /* 접혀있지 않을 때만 적용 */
}

.main-menu-li.collapsed {
  transform: none; /* 접혀있을 때는 앞으로 밀리지 않음 */
}


/* 토글 버튼 디자인 */
.toggle-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-button {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background-color: #1d1e2a;
  position: relative;
  transition: background-color 0.3s ease;
}

.toggle-button.on {
  background-color: #e8e5e5;
}

.toggle-button.on .toggle-circle {
  background-color: black;
}

.toggle-button.on .small-circle {
  background-color: white;
}

.toggle-circle {
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 5px;
  transition: right 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button.on .toggle-circle {
  right: calc(100% - 24px);
}

.small-circle {
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 50%;
}

.auth-section {
  position: absolute;
  bottom: 20rem;
  margin: 20px 0;
  padding: 10px 15px;
}

</style>
