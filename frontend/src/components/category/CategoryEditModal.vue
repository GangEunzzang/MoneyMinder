<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>카테고리 수정</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="category-name">카테고리 이름</label>
          <input type="text" v-model="editedCategory.categoryName" placeholder="카테고리 이름 입력" required/>
        </div>

        <div class="form-group">
          <label for="description">카테고리 설명</label>
          <input type="text" v-model="editedCategory.description" placeholder="설명 입력" required/>
        </div>

        <div class="button-group">
          <button type="submit">저장</button>
          <button type="button" @click="closeModal" class="cancel-button">취소</button>
        </div>

        <input type="hidden" v-model="editedCategory.categoryId" />

      </form>
    </div>
  </div>
</template>

<script>

import CategoryAPI from "@/api/category";

export default {
  props: {
    category: Object,
  },
  data() {
    return {
      editedCategory: {...this.category},
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    submitForm() {
      CategoryAPI.updateCategory(this.editedCategory)
          .then(() => {
            this.$emit('close');
            this.$emit('save', this.editedCategory);
          })
          .catch((error) => {
            console.error("카테고리 수정 실패", error);
          });
    },

  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* 약간 어두운 투명 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modal-content h3 {
  margin: 10px 0 30px 0;
  font-size: 1.4rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 18px;
  font-size: 0.7rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>
