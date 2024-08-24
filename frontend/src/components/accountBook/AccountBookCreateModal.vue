<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>가계부 추가</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="date">날짜</label>
          <input type="date" id="date" v-model="formData.transactionDate" required/>
        </div>

        <div class="form-group">
          <label for="memo">메모</label>
          <input type="text" id="memo" v-model="formData.memo"/>
        </div>

        <div class="form-group">
          <label for="amount">금액</label>
          <input type="number" id="amount" v-model="formData.amount" required/>
        </div>

        <div class="form-group">
          <label for="transactionType">수입/지출</label>
          <select id="transactionType" v-model="transactionType">
            <option value="INCOME">수입</option>
            <option value="EXPENSE">지출</option>
          </select>
        </div>

        <!-- 카테고리 선택 박스 -->
        <div class="form-group" v-if="categoryData.length > 0">
          <label for="category">카테고리</label>
          <select id="category" v-model="formData.categoryCode">
            <option v-for="category in filteredCategories" :key="category.categoryCode"
                    :value="category.categoryCode">
              {{ category.categoryName }}
            </option>
          </select>
        </div>
        <button type="submit">추가</button>
        <button type="button" @click="closeModal">취소</button>

      </form>
    </div>
  </div>
</template>

<script>
import AccountBookAPI from "@/api/accountBook"; // 가계부 API 호출 함수 임포트
import CategoryAPI from "@/api/category"; // 카테고리 API 호출 함수 임포트

export default {
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      categoryData: [], // 초기값을 빈 배열로 설정
      formData: this.getInitialFormData(),
      transactionType: "INCOME", // 기본값 설정
    };
  },

  computed: {
    filteredCategories() {
      return this.categoryData.filter(
          (category) => category.categoryType === this.transactionType
      );
    },
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.resetData();
      }
    }
  },

  methods: {
    getCategoryData() {
      CategoryAPI.getCategoryList()
      .then((response) => {
        this.categoryData = response;
      })
      .catch((error) => {
        console.error(error);
      });
    },

    getInitialFormData() {
      const today = new Date().toISOString().split("T")[0];
      return {
        memo: '',
        amount: '',
        transactionDate: today,
        categoryCode: ""
      };
    },

    closeModal() {
      this.$emit('close');
    },

    submitForm() {
      const formDataSubmit = {...this.formData};
      AccountBookAPI.create(formDataSubmit)
      .then(() => {
        window.location.reload(); // 페이지를 새로고침하여 데이터를 다시 가져옵니다.
      })
      .catch((error) => {
        console.error(error);
      });
    },

    resetData() {
      this.formData = this.getInitialFormData();
    }
  },

  created() {
    this.getCategoryData(); // 컴포넌트가 생성될 때 카테고리 데이터를 불러옵니다.
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="button"] {
  background-color: #6c757d;
  margin-left: 10px;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
