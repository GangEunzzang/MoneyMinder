<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <button class="collapse-btn" @click="toggleSidebar">
      {{ isCollapsed ? ' >>' : '<<' }} <!-- 사이드바 접기/펼치기 버튼 -->
    </button>
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
        <ul v-if="item.isOpen && !isCollapsed" class="submenu">
          <li
              v-for="subItem in item.subMenu"
              :key="subItem.name"
              @click="selectMenuItem(subItem.name)"
              :class="{ active: selectedItem === subItem.name }"
          >
            <!-- 서브메뉴는 페이지 이동을 위한 router-link 유지 -->
            <router-link :to="subItem.route">
              {{ subItem.label }}
            </router-link>
          </li>
        </ul>
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
      isCollapsed: false, // 사이드바 접기 상태를 관리
      menuItems: [
        {
          name: 'Dashboard',
          label: '대시보드',
          icon: '📊',
          isOpen: false,
          subMenu: [
            { name: 'monthlyView', label: '∙ 월별 보기', route: '/account-book/monthly-view' },
            { name: 'calendarView', label: '∙ 달력 보기', route: '/account-book/calendar-view' },
          ],
        },
        {
          name: 'transactions',
          label: '수입/지출',
          icon: '💸',
          isOpen: false,
          subMenu: [
            { name: 'transactionList', label: '∙ 수입/지출 내역', route: '/account-book/transaction-list' },
            { name: 'transactionManagement', label: '∙ 수입/지출 관리', route: '/account-book/transaction-management' },
          ],
        },
        {
          name: 'categories',
          label: '카테고리',
          icon: '📂',
          isOpen: false,
          subMenu: [
            { name: 'categoryManagement', label: '∙ 카테고리 관리', route: '/account-book/category-management' },
            { name: 'categoryBudget', label: '∙ 카테고리별 예산등록', route: '/account-book/category-budget' },
          ],
        },
        {
          name: 'budget',
          label: '예산',
          icon: '💰',
          isOpen: false,
          subMenu: [
            { name: 'budgetSettings', label: '∙ 예산 설정', route: '/account-book/budget-settings' },
          ],
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed; // 사이드바 접기/펼치기 토글
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
  height: 80vh;
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
  transition: width 0.3s ease, padding 0.3s ease;
  position: fixed;
  left: 20px;
  top: 10vh;
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

.collapse-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  padding: 0;
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
  transition: background-color 0.2s ease, color 0.2s ease;
  margin-bottom: 10px;
  white-space: nowrap;
}

.sidebar li:hover {
  background-color: #f5f5f5;
}

.sidebar li.active {
  background-color: #e0e0e0;
  color: #007bff;
  border-left: 4px solid #007bff;
  padding-left: 11px;
}

.icon {
  font-size: 1.5em;
  margin-right: 10px;
}

.label {
  white-space: nowrap;
}

.submenu {
  padding-left: 15px;
  margin-top: 5px;
}

.submenu li {
  padding: 8px 15px;
  font-size: 0.9em;
  color: #333333;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.submenu li:hover {
  background-color: #f5f5f5;
}

.sidebar ul li ul {
  margin-top: 1.3rem;
}

.sidebar ul li ul li.active {
  background-color: #e0e0e0;
  color: #007bff;
  border-left: 4px solid #007bff;
  padding-left: 11px;
}

</style>