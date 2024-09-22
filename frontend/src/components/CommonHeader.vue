<template>
  <div class="header-container" :class="{ hidden: isHeaderHidden }">
    <!-- 오른쪽 상단: 알림과 프로필 아이콘 -->
    <div class="right-icons">
      <!-- 알림 아이콘 -->
      <div class="notification-wrapper">
        <font-awesome-icon icon="bell" class="bell-icon" />
        <div class="notification-count" v-if="notificationCount > 0">
          {{ notificationCount }}
        </div>
      </div>

      <!-- 프로필 아이콘 -->
      <div class="profile-icon-wrapper">
        <font-awesome-icon icon="user-circle" class="profile-icon" />
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getNameFromToken } from "@/utils/jwt";

export default {
  props: {
    notificationCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isHeaderHidden: false,
      lastScrollPosition: 0,
      userName: ''
    };
  },
  methods: {
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition > this.lastScrollPosition) {
        // 스크롤을 아래로 할 때 헤더 숨기기
        this.isHeaderHidden = true;
      } else {
        // 스크롤을 위로 할 때 헤더 보이기
        this.isHeaderHidden = false;
      }
      this.lastScrollPosition = currentScrollPosition;
    },
    getUserName() {
      const token = localStorage.getItem('accessToken');
      this.userName = getNameFromToken(token);
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.getUserName();
  },

};
</script>

<style scoped>
.header-container {
  position: fixed; /* 화면 상단에 고정 */
  top: 0;
  right: 0; /* 오른쪽 상단에 고정 */
  display: flex;
  padding: 1rem;
  background-color: #141418;
  z-index: 1000;
  transition: transform 0.15s ease-in-out; /* 스크롤 시 부드러운 트랜지션 */
}

.header-container.hidden {
  transform: translateY(-100%); /* 헤더 숨기기 */
}

.right-icons {
  display: flex;
  align-items: center;
}

.notification-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 1.5rem;
  border-radius: 100%;
  cursor: pointer;
  border: 1px solid #4f4f4f;
  padding: 11px;
  margin-right: 1rem;
}

.bell-icon {
  font-size: 1.3rem;
  color: #ccc;
  cursor: pointer;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.79rem;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
}

.profile-icon-wrapper {
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem 0.4rem 0.4rem;
  border-radius: 20px;
  border: 1px solid #4f4f4f;
}

.profile-icon {
  font-size: 1.8rem;
  color: white;
  margin-right: 0.5rem;
}

.user-name {
  font-size: 1rem;
  color: #ffffff;
}
</style>
