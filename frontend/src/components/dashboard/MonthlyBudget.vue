<template>
  <div class="dashboard-budget">

      <div class="category-chart">
        <canvas id="categoryPieChart"></canvas>
        <div class="total-expense-label">
          <p>총 예산 </p>
          <p class="total-budget">₩{{ totalExpense.toLocaleString() }} </p>
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
  },  data() {
    return {
      chart: null,
      topCategories: [],
      totalIncome: 0,  // 총 수입을 저장할 변수
      totalExpense: 0,  // 총 지출을 저장할 변수
      categoryData: [],  // 카테고리별 데이터를 저장할 변수
    };
  },
  methods: {
    // budgetAPI를 사용하여 데이터 가져오기
    fetchBudgetData() {
      BudgetAPI.getList('', this.year, this.month)
          .then(response => {
            console.log(response);
            const budgetData = response;

            // 카테고리 데이터 필터링 및 수입/지출 계산
            this.categoryData = budgetData.map(item => ({
              name: item.categoryName,
              amount: item.amount,
              type: item.categoryType
            }));

            this.totalIncome = budgetData
                .filter(item => item.categoryType === 'INCOME')
                .reduce((acc, item) => acc + item.amount, 0);

            this.totalExpense = budgetData
                .filter(item => item.categoryType === 'EXPENSE')
                .reduce((acc, item) => acc + item.amount, 0);

            // 차트와 카테고리 업데이트
            this.updateTopCategories();
            this.createDoughnutChart();
          })
          .catch(error => {
            console.error('Error fetching budget data:', error);
          });
    },

    createDoughnutChart() {
      // 카테고리 데이터를 amount 값에 따라 내림차순으로 정렬
      const sortedCategoryData = [...this.categoryData].sort((a, b) => b.amount - a.amount);

      const ctx = document.getElementById('categoryPieChart').getContext('2d');
      const categoryLabels = sortedCategoryData.map((item) => item.name);
      const categoryAmounts = sortedCategoryData.map((item) => item.amount);
      const categoryColors = this.getCategoryColors(sortedCategoryData.length);

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
              position: 'left',  // 범례를 차트 왼쪽에 배치
              labels: {
                usePointStyle: true,  // 둥근 원 스타일
                padding: 23,  // 범례 항목 간의 간격
                color: '#cccaca',  // 범례 텍스트 색상
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
    this.fetchBudgetData();  // 컴포넌트가 마운트될 때 데이터 가져오기
  },
  watch: {
    categoryData() {
      if (this.chart) {
        this.chart.destroy();
      }
      this.createDoughnutChart();
      this.updateTopCategories();
    },
  },
};
</script>

<style scoped>
.dashboard-budget {

}

.top-categories h3 {
  margin-bottom: 15px;
}

.top-categories ul {
  list-style: none;
  padding: 0;
}

.top-categories li {
  margin-bottom: 10px;
}

.category-chart {
  position: relative;
  width: 300px;
  height: 300px;
}

.total-expense-label {
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
</style>
