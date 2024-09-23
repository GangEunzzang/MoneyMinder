<template>
  <div class="budget-basic">
    <h2>예산</h2>

    <div class="date-container">
      <div class="date-icon" @click="toggleMonthSelect">
        <font-awesome-icon icon="calendar-alt" class="icon-style"/>
      </div>

      <div v-if="selectedDate" class="selected-date-display">
        {{ selectedYear }}년 {{ selectedMonth }}월
      </div>

      <div class="arrow-container">
        <div class="arrow-up" @click="incrementMonth">
          <font-awesome-icon icon="arrow-up"/>
        </div>
        <div class="arrow-down" @click="decrementMonth">
          <font-awesome-icon icon="arrow-down"/>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
      <!-- 왼쪽: 카테고리별 예산 리스트 -->
      <div v-if="budgetsByCategory.length > 0" class="circle-progress-list" :class="{'full-width': rightContainersFinished}">
        <div v-for="(budget, index) in budgetsByCategory" :key="index" class="circle-progress-item">
          <!-- 카테고리 이름 -->
          <div class="category-name">
            <h3>{{ budget.categoryName }}</h3>
          </div>

          <!-- 프로그레스 바와 금액 정보 -->
          <div class="circle-progress-wrapper">
            <svg class="progress-circle" viewBox="0 0 36 36">
              <path class="circle-bg"
                    d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                    :stroke-dasharray="'100, 100'"
                    :stroke-dashoffset="calculateStrokeDashoffset(budget)"
                    d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="16" class="percentage">
                {{ calculateProgress(budget) }}% 사용
              </text>
              <text x="18" y="21" class="spentAmount">
                ₩{{ formatNumber(budget.amount - budget.totalSpentAmount) }}
              </text>
            </svg>
            <div class="category-info">
              <p>
                <span class="large-text">₩{{ formatNumber(budget.totalSpentAmount) }}</span>
                <span class="divider"> / </span>
                <span class="small-text">₩{{ formatNumber(budget.amount) }}</span>
              </p>

              <!-- 상태 메시지와 이모티콘 추가 -->
              <div :class="statusClass(budget)" class="status-message">
                <font-awesome-icon :icon="statusIcon(budget)" class="status-icon" />
                {{ statusMessage(budget) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        예산이 없어요!
      </div>


      <!-- 오른쪽 컨테이너 영역 -->
      <div v-if="budgetsByCategory.length > 0 && !rightContainersFinished" class="right-containers">
        <!-- 총 예산 및 사용 금액 컨테이너 -->
        <div class="total-budget-container">
          <h3>총 예산 </h3>
          <div class="summary-text">
            <p>₩{{ formatNumber(totalBudget) }}</p>
            <div :class="statusClass(totalBudget)" class="status-message">
              <font-awesome-icon :icon="statusIcon(totalBudget)" class="status-icon" />
              {{ statusMessage(totalBudget) }}
            </div>
          </div>

          <div class="half-circle-wrapper">
            <svg class="half-progress-circle" viewBox="0 0 36 32">
              <path class="circle-bg"
                    d="M2.0845 21
           a 15.9155 15.9155 0 1 1 31.831 0"
              />
              <path class="total-circle"
                    :stroke-dasharray="'100, 100'"
                    :stroke-dashoffset="calculateHalfStrokeDashoffset(totalProgress)"
                    d="M2.0845 21
           a 15.9155 15.9155 0 1 1 31.831 0"
              />
              <text x="18" y="16.5" class="percentage">
                {{ totalProgress.toFixed(0) }}%
              </text>
              <text x="18" y="21.5" class="totalSpentAmount">
                ₩{{ formatNumber(totalSpent) }}
              </text>
            </svg>


          </div>
        </div>

        <!-- 소비 순위 컨테이너 -->
        <div class="consumption-ranking-container">
          <h3>소비 순위</h3>
          <div v-for="(item, index) in sortedBudgets" :key="index" class="ranking-item">
            <p>{{ index + 1 }}. {{ item.categoryName }}</p>
            <p>{{ formatNumber(item.totalSpentAmount) }}원</p>
          </div>
        </div>
      </div>
    </div>



    <!-- 예산 추가 버튼 -->
    <button class="add-budget" @click="openCreateModal">예산 추가</button>
    <BudgetCreateModal
        v-if="showCreateModal"
        :isOpen="showCreateModal"
        :selectedYear="selectedYear"
        :selectedMonth="selectedMonth"
        @close="closeCreateModal"
    />

  </div>

</template>



<script>
import BudgetAPI from '@/api/budget';
import AccountBookAPI from '@/api/accountBook';
import BudgetCreateModal from './BudgetCreateModal.vue';

export default {
  components: {
    BudgetCreateModal,
  },

  name: 'BudgetManagement',
  data() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;

    return {
      selectedDate: formattedDate,
      budgetsByCategory: [], // 카테고리별 예산 데이터
      spendsByCategory: [],
      showCreateModal: false, // 예산 생성 모달
      rightContainersFinished: false, // 오른쪽 컨테이너 표시 여부
    };
  },

  computed: {
    selectedYear() {
      return parseInt(this.selectedDate.split("-")[0], 10);
    },

    selectedMonth() {
      return parseInt(this.selectedDate.split("-")[1], 10);
    },

    startDate() {
      return `${this.selectedYear}-${this.selectedMonth.toString().padStart(2, "0")}-01`;
    },

    endDate() {
      const end = new Date(this.selectedYear, this.selectedMonth, 0);
      return `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, "0")}-${end.getDate()}`;
    },

    // 총 예산과 총 사용 금액 계산
    totalBudget() {
      return this.budgetsByCategory.reduce((total, budget) => total + budget.amount, 0);
    },
    totalSpent() {
      return this.budgetsByCategory.reduce((total, budget) => total + budget.totalSpentAmount, 0);
    },
    totalProgress() {
      if (this.totalBudget === 0) return 0;
      return (this.totalSpent / this.totalBudget) * 100;
    },

    // 소비 순위로 정렬된 예산 목록
    sortedBudgets() {
      return [...this.budgetsByCategory].sort((a, b) => b.totalSpentAmount - a.totalSpentAmount);
    }
  },

  methods: {
    // 반원 Stroke Dash Offset 계산
    calculateHalfStrokeDashoffset(progress) {
      return 50 - (progress / 2);
    },

    formatNumber(number) {
      if (!number) return '0';

      const absNumber = Math.abs(number);
      let formatted = '';

      if (absNumber >= 1e8) {
        formatted = (absNumber / 1e8).toFixed(0) + '억';
      } else if (absNumber >= 1e4) {
        formatted = (absNumber / 1e4).toFixed(1) + '만';
      } else {
        formatted = absNumber.toLocaleString();
      }

      return number < 0 ? '-' + formatted : formatted;
    },

    fetchBudgets() {
      BudgetAPI.getList('', this.selectedYear, this.selectedMonth)
      .then(response => {
        this.budgetsByCategory = response;
        this.fetchCategorySummary();
      })
      .catch(error => {
        console.error('Error fetching budget details:', error);
      });
    },

    fetchCategorySummary() {
      AccountBookAPI.getAmountTotalByCategory(this.startDate, this.endDate)
      .then(response => {
        this.spendsByCategory = response;
        this.mergeBudgetAndSpentData();
      })
      .catch(error => {
        console.error('Error fetching category summary:', error);
      });
    },

    mergeBudgetAndSpentData() {
      this.budgetsByCategory = this.budgetsByCategory.map(budget => {
        const spendData = this.spendsByCategory.find(spend => spend.categoryCode === budget.categoryCode);
        return {
          ...budget,
          totalSpentAmount: spendData ? spendData.totalSpentAmount : 0,
        };
      });
    },

    calculateProgress(budget) {
      if (!budget.totalSpentAmount || !budget.amount) return 0;
      return Math.min((budget.totalSpentAmount / budget.amount) * 100, 100).toFixed(0);
    },

    calculateStrokeDashoffset(budget) {
      const progress = this.calculateProgress(budget);
      return 100 - progress;
    },

    statusMessage(budget) {
      const progress = this.calculateProgress(budget);
      if (progress <= 40) return "Good";
      if (progress <= 60) return "Warning";
      return "Bad";
    },

    statusClass(budget) {
      const progress = this.calculateProgress(budget);
      if (progress <= 40) return "안정";
      if (progress <= 60) return "주의";
      return "경고";
    },

    statusIcon(budget) {
      const progress = this.calculateProgress(budget);
      if (progress <= 40) return "smile";
      if (progress <= 60) return "exclamation-triangle";
      return "skull-crossbones";
    },

    incrementMonth() {
      const year = this.selectedYear;
      const month = this.selectedMonth === 12 ? 1 : this.selectedMonth + 1;
      const newYear = this.selectedMonth === 12 ? year + 1 : year;
      this.selectedDate = `${newYear}-${month.toString().padStart(2, "0")}`;
      this.fetchBudgets();
    },

    decrementMonth() {
      const year = this.selectedYear;
      const month = this.selectedMonth === 1 ? 12 : this.selectedMonth - 1;
      const newYear = this.selectedMonth === 1 ? year - 1 : year;
      this.selectedDate = `${newYear}-${month.toString().padStart(2, "0")}`;
      this.fetchBudgets();
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
    },
  },

  mounted() {
    this.fetchBudgets();
    this.fetchCategorySummary();
  },
};
</script>



<style scoped>
.budget-basic {
  background-color: #141418;
  color: white;
  padding: 1rem 5rem;
}

.date-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.selected-date-display {
  font-size: 1rem;
  color: #ccc;
  border: 1px solid #4f4f4f;
  padding: 10px;
  border-radius: 20px;
  width: 8rem;
  height: 1.5rem;
  text-align: center;
  justify-content: center;
  align-content: center;
}

.arrow-container {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

.arrow-up, .arrow-down {
  cursor: pointer;
  margin: 6px 0;
  color: #c7c6c6;
}

.date-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 1.5rem;
  border-radius: 100%;
  cursor: pointer;
  border: 1px solid #4f4f4f;
  padding: 11px;
  margin-right: 1rem;
}

.icon-style {
  color: #d5d4d4;
  font-size: 1.2rem;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 67rem;
}

.circle-progress-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  }

.circle-progress-item {
  border: 1px solid #4f4f4f;
  border-radius: 20px;
  width: calc(20rem - 10px);
  height: 13rem;
  padding: 0.2rem 0.5rem 0.5rem 1rem;
}

.category-name {
  text-align: left;
  padding-left: 0.7rem;
}

.circle-progress-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.circle-bg {
  fill: none;
  stroke: rgba(207, 201, 245, 0.91);
  stroke-width: 2;
}

.progress-circle {
  width: 9rem;
  height: 9rem;
}

.circle {
  fill: none;
  stroke: #8977f5;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.percentage {
  font-size: 0.18rem;
  fill: #605e5e;
  text-anchor: middle;
}

.spentAmount {
  font-size: 0.22rem;
  fill: white;
  font-weight: bold;
  text-anchor: middle;
}

.category-info {
  flex: 1;
  margin-left: 0.8rem;
}

.large-text {
  font-size: 1.3rem;
  color: #ffffff;
  font-weight: 600;
}

.small-text {
  font-size: 0.8rem;
  color: #e8c8e7;
}

.divider {
  font-size: 1rem;
  color: #cccccc;
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

.status-message {
  display: flex;
  justify-content: center;
  font-size: 0.65rem;
  width: fit-content;
  white-space: nowrap;
  padding: 10px;
  border-radius: 10px;
  font-weight: 300;
}

.status-icon {
  margin-right: 3px;
}

.안정 {
  background-color: #151a16;
  color: #27b737;
}

.주의 {
  background-color: #262119;
  color: #ef5a00;
}

.경고 {
  background-color: #1f1312;
  color: #e1212e;
}

.right-containers {
  display: flex;
  flex-direction: column;
}

.total-budget-container, .consumption-ranking-container {
  padding: 1rem;
  margin-bottom: 20px;
  width: 20rem;
  border: 1px solid #4f4f4f;
  border-radius: 20px;
}

.half-circle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.half-progress-circle {
  width: 15rem;
}

.total-circle {
  fill: none;
  stroke: #8977f5;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.summary-text {
  margin-top: 1rem;
}

.summary-text p {
  font-size:1.8rem;
  padding: 0;
  margin: 0;
}

.totalSpentAmount {
  font-size: 0.22rem;
  fill: white;
  font-weight: bold;
  text-anchor: middle;
}

.consumption-ranking-container .ranking-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #4f4f4f;
}

.consumption-ranking-container .ranking-item:last-child {
  border-bottom: none;
}

.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 3rem;
  color: #726f6f;
}
</style>

