<template>
  <div class="cash-flow-bar-chart">
    <div v-if="isDataEmpty" class="no-data-message">
      <p>데이터가 없습니다.</p>
    </div>

    <div v-else class="bar-chart">
      <canvas id="cashBarChart"></canvas>
    </div>

  </div>
</template>

<script>
import {Chart, registerables} from 'chart.js';
import AccountAPI from '@/api/accountBook';

Chart.register(...registerables);

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
      chart: null,
      incomeData: [],
      expenseData: [],
      isDataEmpty: true,
      weekLabels: ['1주차', '2주차', '3주차', '4주차', '5주차'],
    };
  },

  methods: {
    fetchCashFlowData() {
      AccountAPI.getMonthSummary(this.currentYear, this.currentMonth)
      .then(response => {
        // 응답 데이터에서 주차별 수입 및 지출 데이터 추출
        const weeklySummary = response.weeklySummary;

        // 주차별 데이터를 수집
        this.incomeData = Object.keys(weeklySummary).map(
            week => weeklySummary[week].weekTotalIncome);
        this.expenseData = Object.keys(weeklySummary).map(
            week => weeklySummary[week].weekTotalExpense);

        this.isDataEmpty = this.incomeData.every(income => income === 0) &&
            this.expenseData.every(expense => expense === 0);

        console.log(this.isDataEmpty);

        this.$nextTick(() => {
          if(this.isDataEmpty) {
            return;
          }

          this.createBarChart();
        });
      })
      .catch(error => {
        console.error('Error fetching cash flow data:', error);
      });
    },

    createBarChart() {
      const ctx = document.getElementById('cashBarChart').getContext('2d');

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.weekLabels, // 주차별 레이블
          datasets: [
            {
              label: '수입',
              backgroundColor: '#676bb7', // 수입 막대 색상
              data: this.incomeData,
              borderWidth: 2,
              borderRadius: 17,
              spacing: 3,
              hoverOffset: 4,
            },
            {
              label: '지출',
              backgroundColor: '#bfb8f5', // 지출 막대 색상
              data: this.expenseData,
              borderWidth: 2,
              borderRadius: 17,
              spacing: 3,
              hoverOffset: 4,
            }
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // 범례 위치
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                color: '#ffffff',
                padding: 20,
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `₩${tooltipItem.raw.toLocaleString()}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                stepSize: 0, // y축 간격
                callback: function (value) {
                  return `₩${value.toLocaleString()}`;
                }
              },
              grid: {
                color: '#313131'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  } ,

  mounted() {
    this.fetchCashFlowData();
  },

  watch: {
    currentMonth() {
      this.fetchCashFlowData();
    },

    currentYear() {
      this.fetchCashFlowData();
    }
  }
};
</script>

<style scoped>
.cash-flow-bar-chart {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.bar-chart {
  position: relative;
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
