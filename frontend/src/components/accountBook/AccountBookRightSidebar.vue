<template>
  <div class="right-sidebar">
    <button class="add-button" @click="openModal">+</button>
  </div>
  <!-- 모달 창 -->
  <AccountBookCreateModal
      :isOpen="isModalOpen"
      @close="closeModal"
  />
</template>

<script>
import AccountBookCreateModal from '@/components/accountBook/AccountBookCreateModal.vue';

export default {
  components: {
    AccountBookCreateModal,
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
.right-sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateY(-50%);
  z-index: 1000; /* 사이드바가 모달보다 아래에 표시되지 않도록 z-index 조정 */
}

.add-button {
  font-size: 24px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.add-button:hover {
  color: #ffffff;
  background-color: #0056b3;
}
</style>
