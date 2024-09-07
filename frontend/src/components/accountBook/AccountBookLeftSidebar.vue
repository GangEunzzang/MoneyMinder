<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- 사이드바 열고 닫는 토글 버튼 -->
    <div class="toggle-container" @click="toggleSidebar">
      <div :class="['toggle-button', { 'on': isCollapsed }]">
        <div class="toggle-circle"></div>
      </div>
    </div>

    <!-- 사이드바 메뉴 -->
    <ul>
      <!-- 대메뉴 항목 -->
      <li v-for="item in menuItems" :key="item.name">
        <div @click="toggleSubMenu(item.name)">
          <div :class="{ active: selectedItem === item.name }">
            <span class="icon">{{ item.icon }}</span>
            <span v-if="!isCollapsed" class="label">{{ item.label }}</span>
          </div>
        </div>

        <!-- 서브메뉴 -->
        <transition name="fade-slide">
          <ul v-if="item.isOpen && !isCollapsed" class="submenu">
            <li
                v-for="subItem in item.subMenu"
                :key="subItem.name"
                @click="selectMenuItem(subItem.name)"
                :class="{ active: selectedItem === subItem.name }"
            >
              <router-link :to="subItem.route">
                {{ subItem.label }}
              </router-link>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  props: {
    selectedItem: String, // 부모로부터 현재 선택된 항목을 받아옴
  },
  data() {
    return {
      isCollapsed: false, // 사이드바 토글 상태
      menuItems: [
        {
          name: 'Dashboard',
          label: '대시보드',
          icon: '📊',
          isOpen: false,
          subMenu: [
            {name: 'monthlyView', label: '∙ 월별 보기', route: '/account-book/monthly-view'},
            {name: 'calendarView', label: '∙ 달력 보기', route: '/account-book/calendar-view'},
          ],
        },
        {
          name: 'transactions',
          label: '수입/지출',
          icon: '💸',
          isOpen: false,
          subMenu: [
            {name: 'transactionList', label: '∙ 수입/지출 내역', route: '/account-book/transaction-list'},
            {
              name: 'transactionManagement',
              label: '∙ 수입/지출 관리',
              route: '/account-book/transaction-management'
            },
          ],
        },
        {
          name: 'categories',
          label: '카테고리',
          icon: '📂',
          isOpen: false,
          subMenu: [
            {
              name: 'categoryManagement',
              label: '∙ 카테고리 관리',
              route: '/account-book/category-management'
            },
            {name: 'categoryBudget', label: '∙ 카테고리별 예산등록', route: '/account-book/category-budget'},
          ],
        },
        {
          name: 'budget',
          label: '예산',
          icon: '💰',
          isOpen: false,
          subMenu: [
            {name: 'budgetSettings', label: '∙ 예산 설정', route: '/account-book/budget-settings'},
          ],
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed; // 토글 상태 전환
    },
    toggleSubMenu(name) {
      this.menuItems.forEach((item) => {
        if (item.name === name) {
          item.isOpen = !item.isOpen; // 선택한 대메뉴만 열리고 닫힘
        } else {
          item.isOpen = false; // 다른 대메뉴는 닫힘
        }
      });
    },
    selectMenuItem(name) {
      this.$emit('select', name); // 선택된 서브메뉴 항목을 부모 컴포넌트로 전달
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 180px;
  height: 50vh;
  padding: 15px;
  display: flex;
  flex-direction: column; /* 버튼과 메뉴가 세로로 배치되도록 설정 */
  align-items: flex-start;
  border: 1px solid #e9ecef;
  transition: width 0.3s ease, padding 0.3s ease;
  position: fixed;
  left: 0;
  top: 20vh;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

.sidebar.collapsed {
  width: 60px;
  padding: 15px 5px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  color: #333333;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 20px 0;
  white-space: nowrap;
  font-size: 1.05rem;
  font-weight: bold;
}

.sidebar li.active {
  border-radius: 12px;
  background-color: #f3f6ff;
  color: #425ad5;
}

.sidebar li.active:hover {
  background-color: #e1e8ff;
  color: #2c3ebc;
}

.icon {
  font-size: 1.5em;
  margin-right: 10px;
}

.label {
  white-space: nowrap;
}

.submenu {
  padding-left: 30px;
  margin-top: 5px;
  position: relative;
  width: 150px;
}

.submenu li {
  padding: 8px 10px;
  font-size: 0.8em;
  color: #333333;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 400;
  margin: 10px 0;
}

.submenu li:hover {
  background-color: rgba(199, 199, 199, 0.13);
  border-radius: 12px;
}

.sidebar ul li ul {
  margin-top: 1.3rem;
}

/* 부드러운 슬라이드 애니메이션 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.fade-slide-enter, .fade-slide-leave-to /* .slide-leave-active 이전 */
{
  opacity: 0;
  transform: translateY(-10px);
}


/** 토글 버튼 디자인 */
.toggle-container {
  position: absolute;
  top: 10px; /* 상단에 위치 */
  right: 10px; /* 사이드바의 오른쪽에 위치 */
  width: 50px; /* 토글 버튼 가로 크기 */
  height: 25px; /* 토글 버튼 세로 크기 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-button {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background-color: #4caf50;
  position: relative;
  transition: background-color 0.3s ease;
}

.toggle-button.on {
  background-color: #ccc;
}

.toggle-circle {
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px; /* 버튼 내부에서 중앙에 위치 */
  right: 1px;
  transition: left 0.3s ease;
}

.toggle-button.on .toggle-circle {
  right: calc(100% - 24px); /* ON 상태일 때 오른쪽으로 이동 */
}

</style>
