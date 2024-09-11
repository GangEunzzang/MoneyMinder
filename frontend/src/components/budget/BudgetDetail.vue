<template>
  <div class="budget-detail">
    <h2>{{ year }}년 {{ month }}월 예산</h2>

    <!-- 카테고리별 예산 카드 리스트 -->
    <div class="category-card-list">
      <div v-for="(budget, index) in budgetsByCategory" :key="index" class="category-card">
        <div class="category-header">
          <h3>{{ budget.categoryName }}</h3>
          <span v-if="budget.categoryType === 'INCOME'" class="category-type income">수입</span>
          <span v-else class="category-type expense">지출</span>
        </div>
        <div class="budget-overview">
          <p>예산: {{ budget.budgetAmount ? budget.budgetAmount.toLocaleString() : 0 }} 원</p>
          <p>사용: {{ budget.spentAmount ? budget.spentAmount.toLocaleString() : 0 }} 원</p>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: calculateProgress(budget) + '%' }"></div>
        </div>
      </div>
    </div>

    <button @click="goBack" class="back-button">이전</button>
    <button class="add-budget" @click="openCreateModal">예산 추가</button>

    <BudgetCreateModal
        v-if="showCreateModal"
        :isOpen="showCreateModal"
        @close="closeCreateModal" />
  </div>
</template>


<script>
import BudgetAPI from '@/api/budget';
import BudgetCreateModal from './BudgetCreateModal.vue';
export default {
  components: {
    BudgetCreateModal,
  },

  props: ['year', 'month'], // 라우트에서 전달된 year와 month를 props로 받음
  data() {
    return {
      budgetsByCategory: [], // 카테고리별 예산 데이터
      showCreateModal: false,
    };
  },
  methods: {
    fetchBudgets() {
      // year와 month에 해당하는 예산을 가져오는 API 호출
      BudgetAPI.getList('', this.year, this.month)
          .then(response => {
            this.budgetsByCategory = response;
          })
          .catch(error => {
            console.error('Error fetching budget details:', error);
          });
    },
    calculateProgress(budget) {
      if (!budget.budgetAmount || !budget.spentAmount) return 0;
      return Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100);

    },
    goBack() {
      this.$router.push({name: 'budgetManagement'}); // 뒤로가기 기능
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
    },

  },
  created() {
    this.fetchBudgets(); // 컴포넌트가 생성될 때 데이터 불러오기
  }

};
</script>

<style scoped>
.budget-detail {
  margin: auto;
  padding: 40px 20px;
  background-color: #f9fafc;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.budget-detail h2 {
  margin-bottom: 30px;
  color: #222;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
}

.category-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.category-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 7px 20px;
  width: 220px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.category-type {
  padding: 5px 10px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
}

.category-type.income {
  background-color: #28a745;
}

.category-type.expense {
  background-color: #dc3545;
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

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
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
