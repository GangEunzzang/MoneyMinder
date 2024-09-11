<template>
  <div class="budget-management">
    <h2>예산 관리</h2>

    <!-- 년도 선택 -->
    <div class="year-select">
      <label for="year">년도:</label>
      <select v-model="selectedYear" id="year" @change="fetchBudget">
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <!-- 월별 예산 카드 리스트 -->
    <div class="month-card-list">
      <div v-for="(budgets, month) in groupedMonthlyBudgets" :key="month" class="month-card" @click="openMonthDetail(month)">
        <div class="month-header">{{ month }}월</div>
        <div class="budget-overview">
          <span>예산: {{ calculateTotalBudget(budgets) }} 원</span>
          <span>사용: {{ calculateTotalSpent(budgets) }} 원</span>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: calculateProgress(budgets) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 예산 추가 버튼 -->
    <button class="add-budget" @click="openCreateModal">예산 추가</button>


    <!-- 예산 생성 모달 -->
    <BudgetCreateModal
        v-if="showCreateModal"
        :isOpen="showCreateModal"
        @close="closeCreateModal"
    />

  </div>
</template>

<script>
import BudgetAPI from '@/api/budget';
import BudgetCreateModal from './BudgetCreateModal.vue';

export default {
  components: {
    BudgetCreateModal,
  },

  name: 'BudgetManagement',
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      availableYears: [2023, 2024, 2025], // 지원하는 년도 목록
      monthlyBudgets: [], // 전체 월별 예산 데이터
      groupedMonthlyBudgets: {}, // 월별로 그룹화된 예산 데이터
      selectedMonth: null,
      selectedMonthBudgets: [], // 선택된 월의 예산 상세 데이터
      showCreateModal: false,
    };
  },
  methods: {
    fetchBudget() {
      // 선택된 년도의 예산 데이터를 가져오는 로직
      BudgetAPI.getList('', this.selectedYear, '')
          .then((response) => {
            this.monthlyBudgets = response;
            this.groupMonthlyBudgets(); // 월별 데이터 그룹화
          });
    },
    groupMonthlyBudgets() {
      this.groupedMonthlyBudgets = this.monthlyBudgets.reduce((acc, budget) => {
        if (!acc[budget.month]) {
          acc[budget.month] = [];
        }
        acc[budget.month].push(budget);
        return acc;
      }, {});
    },
    calculateTotalBudget(budgets) {
      // 해당 월의 전체 예산 금액 계산
      return budgets.reduce((sum, budget) => sum + budget.amount, 0);
    },
    calculateTotalSpent(budgets) {
      // 예산 사용 금액 계산 (예시로 예산만 표시, 실제 사용 금액이 있다면 처리)
      return budgets.reduce((sum, budget) => sum + budget.spentAmount || 0, 0);
    },
    calculateProgress(budgets) {
      // 예산 대비 사용 금액의 비율을 계산
      const totalBudget = this.calculateTotalBudget(budgets);
      const totalSpent = this.calculateTotalSpent(budgets);
      if (!totalBudget || !totalSpent) return 0;
      return Math.min((totalSpent / totalBudget) * 100, 100);
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
    },

    openMonthDetail(month) {
      this.$router.push({
        name: 'budgetDetail',
        params: {
          year: this.selectedYear,
          month: month,
        }
      });
    },
    closeDetailModal() {
      this.showDetailModal = false;
    },
  },
  mounted() {
    this.fetchBudget(); // 컴포넌트가 로드될 때 해당 년도의 예산을 가져옴
  },
};
</script>

<style scoped>
.budget-management {
  padding: 40px 20px;
  background-color: #f9fafc;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 80%;
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

.month-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.month-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.month-card:hover {
  transform: translateY(-5px);
}

.month-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.budget-overview {
  font-size: 14px;
  margin-bottom: 15px;
  color: #555;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.add-budget {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.add-budget:hover {
  background-color: #218838;
}

</style>
