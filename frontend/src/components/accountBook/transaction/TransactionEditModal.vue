<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>가계부 수정</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="date">날짜</label>
          <input type="date" id="date" v-model="formData.transactionDate" required/>
        </div>

        <div class="form-group">
          <label for="memo">상세 내역</label>
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
        <button type="submit">수정</button>
        <button type="button" @click="closeModal">취소</button>
      </form>
    </div>
  </div>
</template>

<script>
import AccountBookAPI from "@/api/accountBook";
import CategoryAPI from "@/api/category";

export default {
  props: {
    isOpen: Boolean,
    bookToEdit: Object // 수정할 항목의 데이터를 부모로부터 전달받음
  },

  data() {
    return {
      categoryData: [],
      formData: {},
      transactionType: "",
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
        this.resetData(); // 모달이 열릴 때 데이터를 초기화
      }
    },
    bookToEdit: {
      immediate: true, // bookToEdit가 변경될 때 바로 감지
      handler() {
        if (this.isOpen) {
          this.resetData(); // bookToEdit가 변경될 때 데이터를 초기화
        }
      }
    }
  },

  methods: {
    getCategoryData() {
      return CategoryAPI.getCategoryList()
      .then((response) => {
        this.categoryData = response;
      })
      .catch((error) => {
        console.error(error);
      });
    },

    async resetData() {
      if (this.bookToEdit) {
        await this.getCategoryData(); // 카테고리 데이터를 먼저 가져옴

        // bookToEdit의 categoryCode에 해당하는 카테고리 찾기
        const category = this.categoryData.find(cat => cat.categoryCode === this.bookToEdit.categoryCode);

        if (category) {
          this.transactionType = category.categoryType; // categoryType을 설정
          this.formData = {
            ...this.bookToEdit,
            categoryCode: category.categoryCode // categoryCode를 설정
          };
        } else {
          this.formData = { ...this.bookToEdit };
        }
      }
    },

    closeModal() {
      this.$emit('close');
    },

    submitForm() {
      AccountBookAPI.update(this.formData)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
    }
  },

  mounted() {
    if (this.isOpen) {
      this.resetData(); // 컴포넌트가 마운트될 때 데이터를 초기화
    }
  }
};
</script>

<style scoped>
/* 같은 스타일을 사용합니다 */
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
