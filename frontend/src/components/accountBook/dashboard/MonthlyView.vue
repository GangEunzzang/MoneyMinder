
<template>
  <div class="monthly-view">
    <h2>월별 지출</h2>

    <div class="month-navigation">
      <button @click="prevMonth">◀</button>
      <span>{{ formattedMonth }}</span>
      <button @click="nextMonth">▶</button>
    </div>

    <!-- 로딩이 완료되면 캘린더 및 데이터 표시 -->
    <div v-if="!isLoading">
      <table class="calendar-table">
        <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="column in row.columns" :key="column.key">
            <div>{{ column.render }}</div>
            <div v-if="column.render && transactionsMap[column.render]" class="small-text">
              <span v-if="transactionsMap[column.render].income > 0" class="income-text">
                + {{ transactionsMap[column.render].income.toLocaleString() }}
              </span>
              <br v-if="transactionsMap[column.render].income > 0 && transactionsMap[column.render].expense > 0">
              <span v-if="transactionsMap[column.render].expense > 0" class="expense-text">
                - {{ transactionsMap[column.render].expense.toLocaleString() }}
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-item">
          <span>총 지출</span>
          <span class="expense-amount">{{ totalExpense.toLocaleString() }}원</span>
        </div>
        <div class="summary-item">
          <span>총 수입</span>
          <span class="income-amount">{{ totalIncome.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccountBookAPI from "@/api/accountBook"; // 가계부 API 호출 함수 임포트

export default {
  data() {
    const today = new Date();
    return {
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1, // 월은 0부터 시작하므로 1을 더해줌
      headers: ['일', '월', '화', '수', '목', '금', '토'], // 요일 헤더
      transactions: [], // 날짜별 수입/지출 기록
      transactionsMap: {}, // 날짜별 수입/지출 맵
      totalIncome: 0,  // 총 수입
      totalExpense: 0,  // 총 지출
      isLoading: false, // 로딩 상태 추가
    };
  },
  computed: {
    formattedMonth() {
      return `${this.currentYear}. ${this.currentMonth}`;
    },
    rows() {
      return this.generateCalendarRows(this.currentYear, this.currentMonth);
    },
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.fetchTransactions();
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.fetchTransactions();
    },
    getMonthInfo(year, month) {
      const startDay = new Date(year, month - 1, 1).getDay();
      const endDate = new Date(year, month, 0).getDate();
      return {startDay, endDate};
    },
    calendarGenerator(year, month) {
      const {endDate, startDay} = this.getMonthInfo(year, month);
      const calendar = [];
      let nowDate = 1; // 날짜는 1일부터 시작

      for (let i = 0; i < 6; i++) { // 6주까지 루프 돌도록 설정 (최대 6주)
        const nowWeek = [];
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startDay) {
            nowWeek.push(0);
          } else if (nowDate > endDate) {
            nowWeek.push(0);
          } else {
            nowWeek.push(nowDate); // 현재 날짜 추가
            nowDate++;
          }
        }
        calendar.push(nowWeek);
      }

      return calendar;
    },
    generateCalendarRows(year, month) {
      const datas = this.calendarGenerator(year, month);
      const components = [];

      datas.forEach((week, idx) => {
        const weeks = [];

        week.forEach((date, idx) => {
          weeks.push({
            key: date ? date : `empty_${idx}`,
            render: date ? date : '',
          });
        });

        const weekData = {
          id: `week_${idx}`,
          columns: weeks,
        };

        components.push(weekData);
      });

      return components;
    },
    fetchTransactions() {
      this.isLoading = true;
      const startDate = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-01`;
      const endDate = new Date(this.currentYear, this.currentMonth, 0).toISOString().split('T')[0];

      AccountBookAPI.getList(null, "", startDate, endDate)
      .then((response) => {
        this.transactions = response;
        this.createTransactionMap();
      })
      .finally(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
      });
    },

    createTransactionMap() {
      let incomeSum = 0;
      let expenseSum = 0;
      const map = {};

      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.transactionDate).getDate();
        if (!map[date]) {
          map[date] = {income: 0, expense: 0};
        }
        if (transaction.categoryType === "EXPENSE") {
          map[date].expense += transaction.amount;
          expenseSum += transaction.amount;  // 총 지출 계산
        } else {
          map[date].income += transaction.amount;
          incomeSum += transaction.amount;  // 총 수입 계산
        }
      });

      this.transactionsMap = map;
      this.totalIncome = incomeSum;  // 계산한 총 수입 저장
      this.totalExpense = expenseSum;  // 계산한 총 지출 저장
    }
  },
  mounted() {
    this.fetchTransactions();
  },
}
</script>

<style scoped>
.monthly-view {
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 1100px;
  width: 65%;
}

.monthly-view h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.month-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.month-navigation button {
  background: none;
  border: none;
  font-size: 1.0rem;
  cursor: pointer;
}

.month-navigation span {
  font-size: 1.1rem;
  margin: 0 5px;
}

.calendar-table {
  width: 95%;
  border-collapse: collapse;
  margin: auto;
  background-color: white;
  border-radius: 25px;
  height: 75%;
}

.calendar-table th {
  padding: 40px 5px 25px 0;
  text-align: center;
  font-size: 1.0rem;
  font-weight: 200;
  color: rgb(151, 151, 152);
}

.calendar-table td {
  font-size: 1.0rem;
  font-weight: 300;
  padding: 25px 5px 0 0;
  text-align: center;
  vertical-align: middle;
  height: 50px;
  position: relative;
}

.small-text {
  font-size: 0.65rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
}

.income-text {
  color: #0368af;
}

.expense-text {
  color: red;
}

.summary-box {
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
  background-color: #529cf6;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 50%;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-item span {
  font-size: 0.85rem;
  color: #ffffff;
}

.expense-amount, .income-amount {
  color: #ff4d4d;
  font-weight: bold;
  font-size: 1.0rem;
  margin-top: 8px;
}

</style>