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
  display: flex;
  justify-content: flex-end;
  padding: 1rem 2rem;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.right-icons {
  display: flex;
  align-items: center;
}

.notification-wrapper {
  position: relative;
  margin-right: 1.5rem;
}

.bell-icon {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
}

.profile-icon-wrapper {
  display: flex;
  align-items: center;
  background-color: #2f2f2f;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid #4f4f4f;
}

.profile-icon {
  font-size: 1.6rem;
  color: #ccc;
  margin-right: 0.5rem;
}

.user-name {
  font-size: 1rem;
  color: #ffffff;
}
</style>
