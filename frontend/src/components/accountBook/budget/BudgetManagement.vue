<template>
  <div class="budget-management">
    <h2>예산 관리</h2>

    <!-- 년도 선택 -->
    <div class="year-select">
      <label for="year">년도 선택:</label>
      <select v-model="selectedYear" id="year" @change="fetchBudget">
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <!-- 월별 예산 리스트 -->
    <div class="month-list">
      <ul>
        <li v-for="(budget, month) in monthlyBudgets" :key="month">
          <div class="month-item">
            <span>{{ month }}월</span>
            <span>{{ budget }} 원</span>
            <div class="actions">
              <button @click="openEditModal(month)">수정</button>
              <button @click="confirmDelete(month)">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <button class="add-budget" @click="openCreateModal">예산 추가</button>

  </div>
</template>

<script>

export default {
  name: 'BudgetManagement',

  data() {
    return {
      selectedYear: new Date().getFullYear(),
      availableYears: [2023, 2024, 2025], // 지원하는 년도 목록
      monthlyBudgets: {}, // 월별 예산 데이터
      showBudgetModal: false,
      isEdit: false,
      selectedMonth: null,
      selectedBudget: 0,
    };
  },
  methods: {
    fetchBudget() {
      // 선택된 년도의 예산 데이터를 가져오는 로직
      // 예시: 데이터를 가져와서 monthlyBudgets에 저장
      this.monthlyBudgets = {
        1: 500000,
        2: 450000,
        3: 600000,
        // 예시로 임의 데이터를 추가해놨습니다.
      };
    },
    openCreateModal() {
      this.isEdit = false;
      this.selectedMonth = null;
      this.selectedBudget = 0;
      this.showBudgetModal = true;
    },
    openEditModal(month) {
      this.isEdit = true;
      this.selectedMonth = month;
      this.selectedBudget = this.monthlyBudgets[month];
      this.showBudgetModal = true;
    },
    closeBudgetModal() {
      this.showBudgetModal = false;
    },
    saveBudget({ month, budget }) {
      this.monthlyBudgets[month] = budget;
      this.showBudgetModal = false;
    },
    confirmDelete(month) {
      if (confirm(`${month}월 예산을 삭제하시겠습니까?`)) {
        this.deleteBudget(month);
      }
    },
    deleteBudget(month) {
      this.$delete(this.monthlyBudgets, month);
    },
  },
  mounted() {
    this.fetchBudget(); // 컴포넌트가 로드될 때 해당 년도의 예산을 가져옴
  },
};
</script>

<style scoped>
.budget-management {
  margin: auto;
  padding: 40px 20px;
  background-color: #f9fafc;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  width: 50%;
}

.budget-management h2 {
  margin-bottom: 30px;
  color: #222;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 20px;
}

.year-select {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.year-select select {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-left: 10px;
}

.month-list {
  margin-bottom: 20px;
}

.month-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebebeb;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  font-size: 13px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.add-budget {
  margin-top: 20px;
  background-color: #28a745;
}

.add-budget:hover {
  background-color: #218838;
}
</style>
