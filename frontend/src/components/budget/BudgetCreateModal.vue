<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>예산 추가</h3>
      <form @submit.prevent="submitForm">
        <!-- 년/월 선택 -->
        <div class="form-group">
          <label for="budgetMonth">년도/월</label>
          <input type="month" id="budgetMonth" v-model="formData.budgetDate" required/>
        </div>

        <div class="form-group">
          <label for="amount">예산 금액</label>
          <input type="number" id="amount" v-model="formData.amount" required/>
        </div>

        <div class="form-group">
          <label for="category">카테고리</label>
          <select id="category" v-model="formData.categoryCode" required>
            <option v-for="category in categoryData" :key="category.categoryCode" :value="category.categoryCode">
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
import BudgetAPI from "@/api/budget"; // 예산 API 호출 함수 임포트
import CategoryAPI from "@/api/category"; // 카테고리 API 호출 함수 임포트

export default {
  props: {
    isOpen: Boolean,
    selectedYear: Number,
    selectedMonth: Number
  },
  data() {
    return {
      categoryData: [], // 초기값을 빈 배열로 설정
      formData: this.getInitialFormData(),
    };
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
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');

      return {
        amount: '',
        budgetDate: `${year}-${month}`,
        categoryCode: ''
      };
    },

    closeModal() {
      this.$emit('close');
    },

    submitForm() {
      // budgetDate에서 년도와 월을 추출
      const [year, month] = this.formData.budgetDate.split('-');

      // formDataSubmit에 년과 월을 추가하여 API에 전달
      const formDataSubmit = {
        amount: this.formData.amount,
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        categoryCode: this.formData.categoryCode,
      };

      BudgetAPI.createBudget(formDataSubmit)
          .then(() => {
            window.location.reload(); // 페이지를 새로고침하여 데이터를 다시 가져옵니다.
          })
          .catch((error) => {
            console.error(error);
          });
    },

    resetData() {
      console.log(this.selectedYear);
      console.log(this.selectedMonth);
      if (this.selectedYear && this.selectedMonth) {
        this.formData.budgetDate = `${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}`;
      } else {
        this.formData = this.getInitialFormData();
      }
    }
  },

  watch: {
    isOpen: {
      handler(newVal) {
        if (newVal) {
          this.resetData();
        }
      },
      immediate: true,
      deep: true,
    },
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
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modal-content h3 {
  margin: 10px 0 30px 0 ;
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

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
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
