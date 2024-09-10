<template>
  <div class="category-management">
    <h2>카테고리 관리</h2>

    <div class="management-container">

      <div class="tabs">
        <button :class="{ active: activeTab === 'INCOME' }" @click="activeTab = 'INCOME'">수입</button>
        <button :class="{ active: activeTab === 'EXPENSE' }" @click="activeTab = 'EXPENSE'">지출</button>
        <!-- 기본 카테고리만 보기 체크박스 -->
        <div class="basic-btn">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="showCustomOnly">
            <span class="checkmark"></span>
            사용자 정의 카테고리만 보기
          </label>
        </div>
      </div>

      <!-- 카테고리 리스트 -->
      <div class="category-list">

        <ul>
          <li class="category-list-header">
            <span>카테고리 이름</span>
          </li>

          <li v-for="category in filteredCategories" :key="category.categoryId" class="category-list-body">
            <span>{{ category.categoryName }}</span>
            <div class="actions" v-if="category.isCustom">
              <div class="action-icon" @click="openEditModal(category)">
                ✏️
                <span class="tooltip">수정하기</span>
              </div>
              <div class="action-icon" @click="confirmDelete(category.categoryId)">
                🗑️
                <span class="tooltip">삭제하기</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <button class="add-category" @click="openCreateModal">카테고리 추가</button>

      <!-- 카테고리 생성 모달 -->
      <CategoryCreateModal
          v-if="showCreateModal"
          :categoryType="activeTab"
          @close="closeCreateModal"
          @create="createCategory"
      />

      <!-- 카테고리 수정 모달 -->
      <CategoryEditModal
          v-if="showEditModal"
          :category="selectedCategory"
          @close="closeEditModal"
          @save="updateCategory"
      />
    </div>
  </div>
</template>

<script>
import CategoryAPI from "@/api/category";
import CategoryCreateModal from './CategoryCreateModal.vue';
import CategoryEditModal from './CategoryEditModal.vue';

export default {
  name: 'CategoryManagement',
  components: {
    CategoryCreateModal,
    CategoryEditModal,
  },
  data() {
    return {
      activeTab: 'INCOME',  // 현재 탭 (수입/지출)
      showCustomOnly: false,  // 내가 생성한 카테고리만 보기 상태
      categories: [],  // 모든 카테고리 데이터
      selectedCategory: null,  // 선택된 카테고리
      showCreateModal: false,  // 카테고리 생성 모달 표시 여부
      showEditModal: false,  // 카테고리 수정 모달 표시 여부
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => {
        const isTabMatched = category.categoryType === this.activeTab;  // 활성화된 탭과 카테고리 타입이 맞는지 확인
        const isCustomMatched = this.showCustomOnly ? category.isCustom === true : true;  // showCustomOnly가 true일 경우 사용자 정의 카테고리만 표시
        return isTabMatched && isCustomMatched;
      });
    },
  },

  methods: {
    openCreateModal() {
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    openEditModal(category) {
      console.log(category);
      this.selectedCategory = category;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    createCategory(newCategory) {
      this.categories.push(newCategory);
      this.showCreateModal = false;
    },
    updateCategory(updatedCategory) {
      const index = this.categories.findIndex(category => category.categoryId === updatedCategory.categoryId);
      if (index !== -1) {
        this.categories.splice(index, 1, updatedCategory);
      }
      this.showEditModal = false;
    },
    confirmDelete(categoryId) {
      if (confirm("삭제하시겠습니까?")) {
        this.deleteCategory(categoryId);
      }
    },
    deleteCategory(categoryId) {
      CategoryAPI.deleteCategory(categoryId)
          .then(() => {this.categories = this.categories.filter(category => category.categoryId !== categoryId);})
          .catch(error => {console.error('Error deleting category:', error);});
    },
    getCategoryList() {
      CategoryAPI.getCategoryList()
          .then(categories => {
            this.categories = categories;
          })
          .catch(error => {
            console.error('Error loading categories:', error);
          });
    },
  },
  mounted() {
    this.getCategoryList();
  },
};
</script>

<style scoped>
.category-management {
  margin: auto;
  padding: 40px 20px;
  background-color: #f9fafc;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  width: 50%;
}

.category-management h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 20px; /* 탭 사이 간격을 조정 */
  margin-bottom: 20px;
}

.tabs button {
  position: relative;
  padding: 10px 20px; /* 여백을 넉넉히 줘서 버튼이 더 눈에 띄게 */
  font-size: 14px;
  font-weight: 600;
  background-color: transparent;
  color: #555;
  border: none;
  border-bottom: 2px solid transparent; /* 기본 테두리 제거 */
  cursor: pointer;
  transition: all 0.3s ease; /* 부드러운 전환 효과 */
  white-space: nowrap;
}

.tabs button:hover {
  color: #007bff; /* 호버 시 텍스트 색상을 변경 */
  border-bottom: 2px solid #007bff; /* 호버 시 하단 테두리 강조 */
}

.tabs button.active {
  color: #007bff; /* 활성화된 탭의 색상 */
  border-bottom: 2px solid #007bff; /* 활성화된 탭 하단 강조 */
  font-weight: 600; /* 활성화된 탭의 텍스트 굵게 */
}

.tabs button::before {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  background-color: #007bff; /* 애니메이션 색상 */
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  transition: width 0.3s ease; /* 애니메이션 */
}

.tabs button:hover::before {
  width: 100%; /* 호버 시 애니메이션 확장 */
}

.tabs button.active::before {
  width: 100%; /* 활성화된 탭의 밑줄을 완전히 보여줌 */
}

.basic-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 28px; /* 체크박스와 텍스트 간격 */
}

.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 0;
  height: 18px;
  width: 18px;
  background-color: #e9ecef;
  border: 2px solid #007bff;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: #007bff;
  border-color: #007bff;
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox .checkmark:hover {
  background-color: #f0f2f5;
}

.management-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: white;
  border: 2px solid white;
  padding: 10px 30px;
}

.category-list {
  width: 100%;
}

.category-list-header {
  background-color: rgba(52, 185, 80, 0.77);
  font-weight: 600;
  color: white;
  width: 70%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.category-list-header span {
  font-size: 1.05rem;
  flex: 1;
  text-align: center;
}

.category-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:10px 0;
  border-bottom: 1px solid #ebebeb;
  transition: background-color 0.3s ease;
  position: relative;
  border-radius: 20px;
}

.category-list-body:hover {
  background-color: #e0dfdf;
}

.category-list-body span {
  flex: 1;
  font-size: 1rem;
  text-align: center;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.category-list li:hover .actions {
  opacity: 1;
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  position: relative;
}

.action-icon .tooltip {
  visibility: hidden;
  background-color: #333;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%; /* 툴팁을 위쪽에 표시 */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.action-icon:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.add-category {
  width: 7.0rem;
  height: 2.2rem;
  display: inline-block;
  margin-top: 20px;
  padding: 5px;
  font-size: 13px;
  background-color: rgba(52, 185, 80, 0.77);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.add-category:hover {
  background-color: #218838;
}

</style>
