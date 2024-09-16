<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>카테고리 상세보기</h3>
        <div class="form-group">
          <label for="category-name">카테고리 이름</label>
          <input type="text" v-model="DetailsCategory.categoryName" readonly/>
        </div>

        <div class="form-group">
          <label for="description">카테고리 설명</label>
          <input type="text" v-model="DetailsCategory.description" readonly/>
        </div>

      <div class="form-group">
        <label for="categoryType">카테고리 종류</label>
        <input type="text" :value="DetailsCategory.categoryType === 'INCOME' ? '수입' : '지출'" readonly />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    category: Object,
  },
  data() {
    return {
      DetailsCategory: {...this.category},
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  color: black;
  padding: 25px;
  border-radius: 25px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
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

</style>
