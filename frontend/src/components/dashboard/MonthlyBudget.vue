<template>
  <div class="dashboard-budget">

    <div v-if="totalBudget === 0" class="no-data-message">
      <p>데이터가 없습니다.</p>
    </div>

    <div v-else class="category-chart">
      <canvas id="categoryPieChart"></canvas>
      <div class="total-budget-label">
        <p>총 예산 </p>
        <p class="total-budget">₩{{ totalBudget.toLocaleString() }} </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import BudgetAPI from '@/api/budget';

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
      topCategories: [],
      totalBudget: 0,  // 총 지출을 저장할 변수
      categoryData: [],  // 카테고리별 데이터를 저장할 변수
    };
  },
  methods: {
    fetchBudgetData() {
      BudgetAPI.getList('', this.currentYear, this.currentMonth)
      .then(response => {
        const budgetData = response;

        this.categoryData = budgetData.map(item => ({
          name: item.categoryName,
          amount: item.amount,
          type: item.categoryType
        }));

        this.totalBudget = budgetData.reduce((acc, item) => acc + item.amount, 0);

        // Vue의 nextTick을 사용하여 DOM이 완전히 렌더링된 후에 차트 생성
        this.$nextTick(() => {
          if(this.totalBudget === 0) {
            return;
          }
          this.updateTopCategories();
          this.createDoughnutChart();
        });
      })
      .catch(error => {
        console.error('Error fetching budget data:', error);
      });
    },

    createDoughnutChart() {
      const sortedCategoryData = [...this.categoryData]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);

      const ctx = document.getElementById('categoryPieChart').getContext('2d');
      const categoryLabels = sortedCategoryData.map((item) => item.name);
      const categoryAmounts = sortedCategoryData.map((item) => item.amount);
      const categoryColors = this.getCategoryColors(sortedCategoryData.length);

      // 차트가 이미 존재할 경우 안전하게 파괴
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categoryLabels,
          datasets: [
            {
              type: 'doughnut',
              cutout: '80%',
              data: categoryAmounts,
              backgroundColor: categoryColors,
              borderWidth: 0,
              borderRadius: 10,
              spacing: 3,
              hoverOffset: 4,
            }
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'left',
              labels: {
                usePointStyle: true,
                padding: 23,
                color: '#cccaca',
                boxWidth: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const category = sortedCategoryData[tooltipItem.dataIndex];
                  return `${category.name}: ${category.amount.toLocaleString()} 원`;
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },

    getCategoryColors(count) {
      const colors = [
        '#8977f5', '#bfb8f5', '#e4e3f6', '#4d4d55',
        '#888891', '#c1c1c3',
      ];
      return colors.slice(0, count);
    },
    updateTopCategories() {
      this.topCategories = [...this.categoryData]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
    },
  },
  mounted() {
    this.fetchBudgetData();
  },
  watch: {
    currentYear() {
      this.fetchBudgetData();
    },
    currentMonth() {
      this.fetchBudgetData();
    }
  },
};
</script>

<style scoped>
.dashboard-budget {
}

.category-chart {
  position: relative;
  width: 300px;
  height: 300px;
}

.total-budget-label {
  position: absolute;
  top: 50%;
  left: 65%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.total-budget {
  font-size: 1.2rem;
  margin-top: 10px;
  color: #ffffff;
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
