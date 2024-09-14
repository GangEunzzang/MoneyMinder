<template>
  <div class="dashboard-basic">
    <h2>대시보드</h2>

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

    <div v-if="showMonthSelect" class="date-selector-container">
      <input
          type="month"
          v-model="selectedDate"
          @change="handleMonthChange"
          class="custom-month-picker"
      />
    </div>

    <div class="statistics-container">
      <div class="statistics-box-daily">
        <h3>일별 지출</h3>
        <MonthlyView :currentYear="selectedYear" :currentMonth="selectedMonth"/>
      </div>

      <div class="statistics-box-budget">
        <h3>예산</h3>
        <MonthlyBudget :currentYear="selectedYear" :currentMonth="selectedMonth"/>
      </div>

      <div class="income-expense-container">
        <div class="statistics-box-income">
          <h3> 총 수입</h3>
          <p class="total-money" v-if="totalIncome !== null"> ₩{{
              totalIncome.toLocaleString()
            }}</p>
          <p v-else>수입 데이터를 불러오는 중...</p>
          <div class="percentage-box" :class="incomePercentage >= 0 ? 'positive-bg' : 'negative-bg'"
               v-if="incomePercentage !== null">
            <font-awesome-icon
                class="arrow-icon"
                :icon="incomePercentage >= 0 ? 'arrow-up' : 'arrow-down'"
            />
            <span>
              {{ incomePercentage > 0 ? '+' : '' }}  {{ incomePercentage.toFixed(1) }}%
            </span>
          </div>
          <span class="vs-last-month">vs 지난 달</span>
        </div>

        <div class="statistics-box-expense">
          <h3>총 지출</h3>
          <p class="total-money" v-if="totalExpense !== null"> ₩{{
              totalExpense.toLocaleString()
            }}</p>
          <p v-else>지출 데이터를 불러오는 중...</p>
          <div class="percentage-box"
               :class="expensePercentage >= 0 ? 'negative-bg' : 'positive-bg'"
               v-if="expensePercentage !== null">
            <font-awesome-icon
                class="arrow-icon"
                :icon="expensePercentage >= 0 ? 'arrow-up' : 'arrow-down'"
            />
            <span>
              {{ expensePercentage > 0 ? '+' : '' }}{{ expensePercentage.toFixed(1) }}%
            </span>
          </div>
          <span class="vs-last-month">vs 지난 달</span>
        </div>
      </div>

    </div>

    <div class="statistics-container2">
      <div class="statistics-box-cash-flow">
        <h3>현금 흐름</h3>
        <CashFlowBarChart :currentYear="selectedYear" :currentMonth="selectedMonth"/>
      </div>

      <!-- 가장 큰 수입과 지출을 표시하는 새로운 박스 추가 -->
      <div class="largest-transactions">
        <div class="largest-income">
          <div v-if="largestIncomeInfo != null">
            <h4>가장 큰 수입</h4>
            <p class="amount">₩{{ largestIncomeInfo?.amount?.toLocaleString() }}</p>
            <p class="transaction-date">{{ largestIncomeInfo?.transactionDate }} (
              {{ largestIncomeInfo?.memo }} )</p>
          </div>

          <div v-else class="largest-no-data-message">
            <p>데이터가 없습니다.</p>
          </div>
        </div>


        <div class="largest-expense">
          <div v-if="largestExpenseInfo != null">
            <h4>가장 큰 지출</h4>
            <p class="amount">₩{{ largestExpenseInfo?.amount?.toLocaleString() }}</p>
            <p class="transaction-date">{{ largestExpenseInfo?.transactionDate }} (
              {{ largestExpenseInfo?.memo }} )</p>
          </div>
          <div v-else class="largest-no-data-message">
            <p>데이터가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script>
import MonthlyView from "@/components/dashboard/MonthlyView.vue";
import MonthlyBudget from "@/components/dashboard/MonthlyBudget.vue";
import CashFlowBarChart from "@/components/dashboard/CashFlowBarChart.vue";
import AccountAPI from "@/api/accountBook";

export default {
  components: {
    MonthlyView,
    MonthlyBudget,
    CashFlowBarChart
  },
  data() {
    const currentDate = new Date(); // 현재 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`; // YYYY-MM 형식으로 포맷

    return {
      selectedDate: formattedDate,
      showMonthSelect: false,
      totalIncome: null,
      totalExpense: null,
      previousMonthIncome: null,
      previousMonthExpense: null,
      incomePercentage: null,
      expensePercentage: null,
      largestIncomeInfo: null,
      largestExpenseInfo: null,
    };
  },
  computed: {
    formattedMonth() {
      const [year, month] = this.selectedDate.split("-");
      return `${year}년 ${month}월`;
    },

    selectedYear() {
      return parseInt(this.selectedDate.split("-")[0], 10);
    },

    selectedMonth() {
      return parseInt(this.selectedDate.split("-")[1], 10);
    },

    previousYear() {
      return this.selectedMonth === 1 ? this.selectedYear - 1 : this.selectedYear;
    },
    previousMonth() {
      return this.selectedMonth === 1 ? 12 : this.selectedMonth - 1;
    },

  },
  methods: {
    toggleMonthSelect() {
      this.showMonthSelect = !this.showMonthSelect;
    },

    handleMonthChange(event) {
      this.selectedDate = event.target.value; // YYYY-MM 형식의 문자열을 그대로 저장
      this.showMonthSelect = false;
      this.fetchMonthSummary()
      this.fetchTransactions();
    },

    incrementMonth() {
      const year = this.selectedYear;
      const month = this.selectedMonth === 12 ? 1 : this.selectedMonth + 1;
      const newYear = this.selectedMonth === 12 ? year + 1 : year;
      this.selectedDate = `${newYear}-${month.toString().padStart(2, "0")}`;
      this.fetchMonthSummary();
      this.fetchTransactions();
    },

    decrementMonth() {
      const year = this.selectedYear;
      const month = this.selectedMonth === 1 ? 12 : this.selectedMonth - 1;
      const newYear = this.selectedMonth === 1 ? year - 1 : year;
      this.selectedDate = `${newYear}-${month.toString().padStart(2, "0")}`;
      this.fetchMonthSummary();
      this.fetchTransactions();
    },

    fetchMonthSummary() {
      AccountAPI.getMonthSummary(this.selectedYear, this.selectedMonth)
      .then(response => {
        this.totalIncome = response.monthTotalIncome;
        this.totalExpense = response.monthTotalExpense;
        this.fetchPreviousMonthSummary();
      })
      .catch(error => {
        console.error('Error fetching month summary:', error);
      });
    },

    fetchPreviousMonthSummary() {
      AccountAPI.getMonthSummary(this.previousYear, this.previousMonth)
      .then(response => {
        this.previousMonthIncome = response.monthTotalIncome;
        this.previousMonthExpense = response.monthTotalExpense;
        this.calculatePercentageChanges();
      })
      .catch(error => {
        console.error('Error fetching previous month summary:', error);
      });
    },

    calculatePercentageChanges() {
      if (this.previousMonthIncome > 0) {
        this.incomePercentage = ((this.totalIncome - this.previousMonthIncome)
            / this.previousMonthIncome) * 100;
      } else {
        this.incomePercentage = 0;
      }

      if (this.previousMonthExpense > 0) {
        this.expensePercentage = ((this.totalExpense - this.previousMonthExpense)
            / this.previousMonthExpense) * 100;
      } else {
        this.expensePercentage = 0;
      }
    },

    fetchTransactions() {
      const startDate = `${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}-01`;
      const endDate = new Date(this.selectedYear, this.selectedMonth, 0).toISOString().split(
          'T')[0];

      AccountAPI.getList(null, "", startDate, endDate)
      .then((response) => {

        if (response.length === 0) {
          this.largestIncomeInfo = null;
          this.largestExpenseInfo = null;
          return;
        }

        response.forEach(transaction => {
          if (transaction.categoryType === 'INCOME') {
            if (!this.largestIncomeInfo || transaction.amount > this.largestIncomeInfo.amount) {
              this.largestIncomeInfo = transaction;
            }
          } else {
            if (!this.largestExpenseInfo || transaction.amount > this.largestExpenseInfo.amount) {
              this.largestExpenseInfo = transaction;
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
    }

  },
  mounted() {
    this.fetchMonthSummary();
    this.fetchTransactions();
  }
};
</script>

<style scoped>
.dashboard-basic {
  background-color: #141418;
  color: #fff;
  padding: 1rem 5rem;
}

.date-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
}

.selected-date-display {
  font-size: 1rem;
  color: #ccc;
  border: 1px solid #4f4f4f;
  padding: 10px;
  border-radius: 20px;
  width: 8rem;
  height: 1.5rem;
  justify-content: center;
  align-content: center;
  text-align: center;
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
  position: relative;
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
  margin: 0 !important;
  padding: 0 !important;
}

.date-selector-container {
  position: absolute; /* 절대 위치로 설정 */
  top: 15%; /* 아이콘 바로 아래에 위치하도록 조절 */
  left: 25%; /* 수평으로 가운데 정렬 */
  transform: translateX(-50%); /* 가운데 정렬 보정 */
  z-index: 1000; /* 다른 요소 위에 표시되도록 설정 */
}

.custom-month-picker {
  display: inline-block;
  background-color: #1e1e1e; /* 배경색 */
  color: #ffffff; /* 텍스트 색상 */
  border: none; /* 기본 테두리 제거 */
  padding: 10px 10px; /* 여백 추가 */
  font-size: 1.0rem; /* 폰트 크기 */
  border-radius: 25px;
  width: 10rem;
  max-width: 10rem; /* 최대 너비 설정 */
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-month-picker:hover {
  background-color: #1e1e24; /* 호버 시 배경색 */
  color: #f1f1f1; /* 호버 시 텍스트 색상 */
}

.custom-month-picker:focus {
  outline: none; /* 클릭 시 외곽선 제거 */
  box-shadow: 0 0 10px rgba(147, 138, 236, 0.8); /* 포커스 시 그림자 */
}

.statistics-container {
  display: flex;
}

.statistics-box-daily {
  background-color: #111114;
  border-radius: 50px;
  padding: 2px 10px 18px 10px;
  border: 2px solid #4f4f4f;
  width: 22rem;
  height: 21.2rem;
  margin: 0 1.5rem 0 0;
}

.statistics-box-daily h3 {
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
  text-align: center;
}

.income-expense-container {
  display: flex;
  flex-direction: column;
  width: 20rem;
}

.income-expense-container h3 {
  font-size: 1.2rem;
  color: #ccc;
  text-align: left;
  margin-bottom: 2.1rem;
}

.statistics-box-income {
  margin-bottom: 0.5rem;
}

.statistics-box-income, .statistics-box-expense {
  background-color: #111114;
  border-radius: 30px;
  width: 17rem;
  height: 9.3rem;
  padding: 0 0 26px 2.2rem;
  border: 2px solid #4f4f4f;
}

.statistics-box-income p, .statistics-box-expense p {
  color: #dcdbdb;
  font-size: 1.1rem;
}

.percentage-box {
  display: inline-block;
  padding: 5px 7px;
  border-radius: 20px;
  width: 3.8rem;
}

.percentage-box span {
  font-size: 0.75rem;
}

.total-money {
  font-size: 1.5rem !important;
}

/** 예산 */
.statistics-box-budget {
  background-color: #111114;
  border-radius: 50px;
  padding: 2px 0 15px 0;
  border: 2px solid #4f4f4f;
  width: 20rem;
  height: 21.2rem;
  margin: 0 1.5rem 0 0;
}

.statistics-box-budget h3 {
  color: #ccc;
  font-size: 1.2rem;
  text-align: center;
}

.statistics-container2 {
  margin-top: 1.5rem;
  display: flex;
}

/** 현금 흐름 */
.statistics-box-cash-flow {
  background-color: #111114;
  border-radius: 50px;
  padding: 10px 10px 17px 10px;
  border: 2px solid #4f4f4f;
  width: 44rem;
  height: 22rem;
}

.statistics-box-cash-flow h3 {
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
}

/** 현금흐름 끝 */


.largest-transactions {
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
}

.largest-transactions h4 {
  font-size: 1.2rem;
  color: #ccc;
}

.largest-transactions p {
  font-size: 1.5rem;
  color: #dcdbdb;
}

.largest-income, .largest-expense {
  background-color: #111114;
  border-radius: 30px;
  width: 17rem;
  height: 9.8rem;
  padding: 0 0 26px 2.2rem;
  border: 2px solid #4f4f4f;
}

.largest-no-data-message p{
  font-size: 1.5rem;
  margin: 4rem 0 0 2rem;
  color: #726f6f !important;
}

.largest-income {
  margin-bottom: 0.5rem;
}

.amount {
  font-size: 1.5rem !important;
  color: #dcdbdb;
}

.transaction-date {
  margin-top: 2rem;
  font-size: 1.0rem !important;
  color: #656565 !important;
}


.positive-bg {
  background-color: #151a16;
  color: #27b737;
  text-align: center;
}

.negative-bg {
  background-color: #1f1312;
  color: #e1212e;
  text-align: center;
}

.arrow-icon {
  font-size: 0.85rem !important;
}

.vs-last-month {
  margin-left: 5px;
  color: #858383;
  font-size: 0.75rem;
}


</style>
