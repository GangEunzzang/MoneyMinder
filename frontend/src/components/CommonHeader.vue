<template>
  <div class="header-container">
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
export default {
  props: {
    userName: {
      type: String,
      required: true
    },
    notificationCount: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.header-container {
  position: fixed; /* 화면 상단에 고정 */
  top: 0;
  right: 0; /* 오른쪽 상단에 고정 */
  display: flex;
  padding: 1rem;
  background-color: #141418;
  border-radius: 10px; /* 둥근 모서리 */
  z-index: 1000;
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
  padding: 0.4rem 1rem 0.4rem 0.4rem  ;
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
