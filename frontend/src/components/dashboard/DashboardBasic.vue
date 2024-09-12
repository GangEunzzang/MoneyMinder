<template>
  <div class="dashboard-basic">
    <h2>대시보드</h2>

    <div class="date-picker-icon" @click="toggleDatePicker">
      <font-awesome-icon icon="calendar-alt" class="icon-style"/>
    </div>

    <div v-if="showDatePicker" class="date-picker-container">
      <v-date-picker
          v-model="selectedDate"
          is-inline
          type="month"
          @update:modelValue="handleMonthChange"
      />
    </div>

    <div v-if="selectedDate" class="selected-date-display">
      {{ formattedMonth }}
    </div>

    <div class="statistics-container">
      <div class="statistics-box-daily">
        <h3>일별 지출</h3>
        <MonthlyView :currentYear="selectedYear" :currentMonth="selectedMonth"/>
      </div>

      <div class="income-expense-container">
        <div class="statistics-box-income">
          <h3> 총 수입</h3>
          <p class="total-money" v-if="totalIncome !== null">  ₩{{ totalIncome.toLocaleString() }}</p>
          <p v-else>수입 데이터를 불러오는 중...</p>
          <div class="percentage-box" :class="incomePercentage >= 0 ? 'positive-bg' : 'negative-bg'" v-if="incomePercentage !== null">
            <font-awesome-icon
                class ="arrow-icon"
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
          <p class="total-money" v-if="totalExpense !== null">  ₩{{ totalExpense.toLocaleString() }}</p>
          <p v-else>지출 데이터를 불러오는 중...</p>
          <div class="percentage-box" :class="expensePercentage >= 0 ? 'negative-bg' : 'positive-bg'" v-if="expensePercentage !== null">
            <font-awesome-icon
                class ="arrow-icon"
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
  </div>
</template>

<script>
import MonthlyView from "@/components/dashboard/MonthlyView.vue";
import AccountAPI from "@/api/accountBook";

export default {
  components: {
    MonthlyView,
  },
  data() {
    return {
      selectedDate: new Date(),
      showDatePicker: false,
      totalIncome: null,
      totalExpense: null,
      previousMonthIncome: null,
      previousMonthExpense: null,
      incomePercentage: null,
      expensePercentage: null
    };
  },
  computed: {
    formattedMonth() {
      return `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
    },
    selectedYear() {
      return this.selectedDate.getFullYear();
    },
    selectedMonth() {
      return this.selectedDate.getMonth() + 1;
    },
    previousYear() {
      return this.selectedMonth === 1 ? this.selectedYear - 1 : this.selectedYear;
    },
    previousMonth() {
      return this.selectedMonth === 1 ? 12 : this.selectedMonth - 1;
    },
  },
  methods: {
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker;
    },
    handleMonthChange(date) {
      this.selectedDate = new Date(date.getFullYear(), date.getMonth(), 1);
      this.showDatePicker = false;
      this.fetchMonthSummary();
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
        this.incomePercentage = ((this.totalIncome - this.previousMonthIncome) / this.previousMonthIncome) * 100;
      } else {
        this.incomePercentage = 0;
      }

      if (this.previousMonthExpense > 0) {
        this.expensePercentage = ((this.totalExpense - this.previousMonthExpense) / this.previousMonthExpense) * 100;
      } else {
        this.expensePercentage = 0;
      }
    }
  },
  mounted() {
    this.fetchMonthSummary();
  }
};
</script>

<style scoped>
.dashboard-basic {
  display: flex;
  flex-direction: column;
  background-color: #141418;
  color: #fff;
  padding: 20px;
  height: 100vh;
}

.date-picker-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #25252b;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 10px;
}

.icon-style {
  color: white;
  font-size: 1.5rem;
}

.date-picker-container {
  position: absolute;
  z-index: 100;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
}

.selected-date-display {
  margin-top: 10px;
  color: #ccc;
}

.statistics-container {
  display: flex;
}

.statistics-box-daily {
  background-color: #111114;
  border-radius: 50px;
  padding: 20px;
  border: 2px solid #4f4f4f;
  width: 25rem;
  height: 22rem;
  margin: 0 1.5rem 0 3rem;
}

.statistics-box-daily h3 {
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
}

.income-expense-container {
  display: flex;
  flex-direction: column;
  width: 20rem;
}

.income-expense-container h3 {
  font-size: 1.3rem;
  color: #ccc;
  text-align: left;
  margin-bottom: 2.3rem;
}

.statistics-box-income, .statistics-box-expense {
  background-color: #111114;
  border-radius: 30px;
  height: 11rem;
  padding: 0 0 10px 2.1rem;
  margin-bottom: 20px;
  border: 2px solid #4f4f4f;
  overflow: auto;
}

.statistics-box-income p, .statistics-box-expense p {
  color: #dcdbdb;
  font-size: 1.1rem;
}

.percentage-box {
  display: inline-block;
  padding: 5px;
  border-radius: 20px;
  width: 4.0rem;
}

.percentage-box span {
  font-size: 0.75rem;
}

.total-money {
  font-size: 1.5rem !important;
}

.positive-bg {
  background-color: #151a16;
  color: #27b737;
}

.negative-bg {
  background-color: #1f1312;
  color: #e1212e;
}

.arrow-icon {
  font-size: 0.85rem !important;
  margin-right: 5px;
}

.vs-last-month {
  margin-left: 5px;
  color: #858383;
  font-size: 0.75rem;
}
</style>
