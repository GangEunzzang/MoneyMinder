<template>
  <div class="monthly-view">
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
    </div>
  </div>
</template>

<script>
import AccountBookAPI from "@/api/accountBook";

export default {
  props: {
    currentYear: {
      type: Number,
      required: true
    },
    currentMonth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      headers: ['일', '월', '화', '수', '목', '금', '토'],
      transactions: [],
      transactionsMap: {},
      isLoading: false,
    };
  },
  computed: {
    rows() {
      return this.generateCalendarRows(this.currentYear, this.currentMonth);
    }
  },
  methods: {
    getMonthInfo(year, month) {
      const startDay = new Date(year, month - 1, 1).getDay();
      const endDate = new Date(year, month, 0).getDate();
      return { startDay, endDate };
    },
    calendarGenerator(year, month) {
      const { endDate, startDay } = this.getMonthInfo(year, month);
      const calendar = [];
      let nowDate = 1;

      for (let i = 0; i < 6; i++) {
        const nowWeek = [];
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startDay) {
            nowWeek.push(0);
          } else if (nowDate > endDate) {
            nowWeek.push(0);
          } else {
            nowWeek.push(nowDate);
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
      const map = {};

      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.transactionDate).getDate();
        if (!map[date]) {
          map[date] = { income: 0, expense: 0 };
        }
        if (transaction.categoryType === "EXPENSE") {
          map[date].expense += transaction.amount;
        } else {
          map[date].income += transaction.amount;
        }
      });

      this.transactionsMap = map;
    }
  },
  watch: {
    currentYear() {
      this.fetchTransactions();
    },
    currentMonth() {
      this.fetchTransactions();
    }
  },
  mounted() {
    this.fetchTransactions();
  }
};
</script>

<style scoped>
.monthly-view {
  width: 100%;
}

.calendar-table {
  width: 95%;
  border-collapse: collapse;
  margin: auto;
  color: white;
}

.calendar-table th {
  padding: 0.5rem 0 0.5em 0;
  text-align: center;
  font-size: 1.0rem;
  font-weight: 200;
  color: rgb(166, 165, 165);
}

.calendar-table td {
  font-size: 1.0rem;
  font-weight: 300;
  text-align: center;
  vertical-align: middle;
  height: 2.7rem;
  position: relative;
  padding-top: 0.1rem;
}

.small-text {
  font-size: 0.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 3px;
  text-align: center;
  white-space: nowrap;
}

.income-text {
  color: #0368af;
}

.expense-text {
  color: red;
}
</style>
