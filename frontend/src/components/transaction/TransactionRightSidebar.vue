<template>
  <div class="right-sidebar" @click="openModal">
    <button class="add-button">+</button>
  </div>
  <!-- 모달 창 -->
  <TransactionCreateModal
      :isOpen="isModalOpen"
      @close="closeModal"
  />
</template>

<script>
import TransactionCreateModal from '@/components/transaction/TransactionCreateModal.vue';

export default {
  components: {
    TransactionCreateModal,
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
  z-index: 1000;
  cursor: pointer;
}

.add-button {
  font-size: 24px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

</style>
