<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- 사이드바 열고 닫는 토글 버튼 -->
    <div class="toggle-container" @click="toggleSidebar">
      <div :class="['toggle-button', { 'on': isCollapsed }]">
        <div class="toggle-circle">
          <div class="small-circle"></div> <!-- 작은 원 추가 -->
        </div>
      </div>
    </div>

    <!-- 사이드바 메뉴 -->
    <ul class="main-menu">
      <!-- 대메뉴 항목 -->
      <li class="main-menu-li"
          v-for="item in menuItems"
          :key="item.name"
          :class="{ active: isMenuActive(item) }"
          @mouseover="hoverMenu(item.name)"
          @mouseleave="hoverMenu(null)"
      >
        <div @click="toggleSubMenu(item.name)">
          <div :class="{ active: selectedItem === item.name }">
            <font-awesome-icon :icon="item.icon" class="icon" />
            <!-- 라벨을 전부 펼쳐진 상태일 때만 노출 -->
            <span v-if="showLabels" class="label">{{ item.label }}</span>
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
      showLabels: true, // 라벨 표시 여부
      hoveredMenu: null, // 호버된 대메뉴 상태
      menuItems: [
        {
          name: 'Dashboard',
          label: '대시보드',
          icon: 'home',
          isOpen: false,
          subMenu: [
            { name: 'monthlyView', label: '∙ 월별 보기', route: '/account-book/monthly-view' },
            { name: 'calendarView', label: '∙ 달력 보기', route: '/account-book/calendar-view' },
          ],
        },
        {
          name: 'transactions',
          label: '수입/지출',
          icon: 'wallet',
          isOpen: false,
          subMenu: [
            { name: 'transactionList', label: '∙ 수입/지출 내역', route: '/account-book/transaction-list' },
            {name: 'transactionManagement', label: '∙ 수입/지출 관리', route: '/account-book/transaction-management',
            },
          ],
        },
        {
          name: 'categories',
          label: '카테고리',
          icon: 'folder-open',
          isOpen: false,
          subMenu: [
            { name: 'categoryManagement', label: '∙ 카테고리 관리', route: '/account-book/category-management' },
            { name: 'categoryBudget', label: '∙ 카테고리별 예산등록', route: '/account-book/category-budget' },
          ],
        },
        {
          name: 'budget',
          label: '예산',
          icon: 'money-bill-wave',
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
      this.isCollapsed = !this.isCollapsed; // 토글 상태 전환
      this.showLabels = false; // 토글 중에는 라벨 숨김

      if (this.isCollapsed) {
        this.menuItems.forEach(item => item.isOpen = false);
      }

      // 트랜지션 후에 라벨을 보여줌
      setTimeout(() => {
        if (!this.isCollapsed) {
          this.showLabels = true; // 펼쳐진 후에 라벨을 다시 보여줌
        }
      }, 400); // 트랜지션 시간과 맞춰 설정
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
    hoverMenu(name) {
      this.hoveredMenu = name; // 현재 호버된 대메뉴 저장
    },
    isMenuActive(item) {
      // 대메뉴가 active인지 확인 (현재 페이지의 서브메뉴에 포함되었는지 체크)
      const currentRoute = this.$route.path;
      return item.subMenu.some(subItem => currentRoute === subItem.route) || this.selectedItem === item.name;
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
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #e9ecef;
  transition: width 0.3s ease, padding 0.3s ease;
  position: fixed;
  left: 0;
  top: 20vh;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  background-color: white;
  z-index: 9999;
}


a {
  text-decoration: none;
  color: inherit;
}

.sidebar.collapsed {
  width: 60px;
  padding: 15px 5px;
}

.sidebar.collapsed li {
  width: 1rem;
  margin: 30px auto;
}

.sidebar.collapsed ul {
  margin-top: 60px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 20px 0;
  white-space: nowrap;
  font-size: 1.05rem;
  font-weight: bold;
}

.icon {
  font-size: 1.1em;
  margin-right: 10px;
  color: #575353;
}

.label {
  white-space: nowrap;
  font-size: 1.1rem;
  color: #959596;
}

.submenu {
  padding-left: 30px;
  margin-top: 5px;
  position: relative;
}

.submenu li {
  padding: 8px 10px;
  font-size: 0.8em;
  color: #333333;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 400;
  margin: 10px 0;
  border-radius: 12px;
}

.sidebar ul li ul {
  margin-top: 1.3rem;
}

.main-menu {
  margin-top: 4.5rem;
}

.main-menu-li {
  width: 10rem;
}

/* 대메뉴 호버 효과 */
.main-menu-li:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

/* 서브메뉴 호버 효과 */
.submenu li:hover {
  background-color: rgba(49, 46, 46, 0.13);
  border-radius: 12px;
}

/* 대메뉴 active 상태 스타일 */
.main-menu-li.active {
  background-color: #e0e0e0;
  color: #000000;
  border-radius: 12px;
}

/* 서브메뉴 active 상태 스타일 */
.submenu li.active {
  background-color: #c0c0c0;
  border-radius: 12px;
  color: #000000;
  font-weight: bold;
}

.sidebar li.active .icon, .sidebar li.active .label {
  color: #000000;
}



/* 토글 버튼 디자인 */
.toggle-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-button {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background-color: #1d1e2a;
  position: relative;
  transition: background-color 0.3s ease;
}

.toggle-button.on {
  background-color: #e8e5e5;
}

.toggle-button.on .toggle-circle {
  background-color: black;
}

.toggle-button.on .small-circle {
  background-color: white;
}

.toggle-circle {
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 5px;
  transition: right 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button.on .toggle-circle {
  right: calc(100% - 24px);
}

.small-circle {
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 50%;
}
</style>
