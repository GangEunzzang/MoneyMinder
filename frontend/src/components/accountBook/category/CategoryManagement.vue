<template>
  <div class="category-management">
    <h2>카테고리 관리</h2>

    <!-- 수입/지출 탭 -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'INCOME' }" @click="activeTab = 'INCOME'">수입</button>
      <button :class="{ active: activeTab === 'EXPENSE' }" @click="activeTab = 'EXPENSE'">지출</button>
    </div>

    <div class="management-container">
      <!-- 카테고리 리스트 -->
      <div class="category-list">
        <h2>{{ activeTab === 'INCOME' ? '수입 카테고리 목록' : '지출 카테고리 목록' }}</h2>
        <ul>
          <li v-for="category in filteredCategories" :key="category.id">
            <span>{{ category.categoryName }}</span>
            <div class="actions">
              <button @click="editCategory(category)">수정</button>
              <button @click="deleteCategory(category.id)">삭제</button>
            </div>
          </li>
        </ul>
        <button class="add-category" @click="addCategory">카테고리 추가</button>
      </div>

      <!-- 카테고리 상세 정보 및 수정 -->
      <div class="category-details" v-if="selectedCategory">
        <h2>카테고리 상세 정보</h2>
        <div class="form-group">
          <label for="category-name">카테고리 이름</label>
          <input type="text" v-model="selectedCategory.name" id="category-name" />
          <label for = "description">카테고리 설명</label>
          <input type="text" v-model="selectedCategory.description" id="description" />
          <input type="hidden" v-model="selectedCategory.type" />

        </div>
        <button @click="saveCategory">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryAPI from "@/api/category";

export default {
  name: 'CategoryManagement',
  data() {
    return {
      activeTab: 'INCOME', // 현재 활성화된 탭 ('INCOME' or 'EXPENSEs')
      categories: [],
      selectedCategory: null, // 선택된 카테고리
    };
  },
  computed: {
    filteredCategories() {
      // 활성화된 탭에 따라 필터링된 카테고리 반환
      return this.categories.filter(category => category.categoryType === this.activeTab);
    }
  },
  methods: {
    addCategory() {
      const newCategory = { id: Date.now(), name: '새 카테고리', type: this.activeTab };
      this.categories.push(newCategory);
      this.selectedCategory = newCategory;
    },
    editCategory(category) {
      this.selectedCategory = { ...category };
    },
    deleteCategory(id) {
      this.categories = this.categories.filter(category => category.id !== id);
      if (this.selectedCategory && this.selectedCategory.id === id) {
        this.selectedCategory = null;
      }
    },
    saveCategory() {
      const index = this.categories.findIndex(category => category.id === this.selectedCategory.id);
      if (index !== -1) {
        this.categories.splice(index, 1, this.selectedCategory);
        this.selectedCategory = null;
      }
    },

    getCategoryList() {
      CategoryAPI.getCategoryList()
        .then(categories => {
          console.log(categories);
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
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 1100px;
  width: 90%;
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
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f1f1f1;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover {
  background-color: #ddd;
}

.management-container {
  display: flex;
  gap: 20px;
}

.category-list {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.category-list h2 {
  margin-bottom: 10px;
}

.category-list ul {
  list-style: none;
  padding: 0;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.category-list li .actions button {
  margin-left: 5px;
}

.add-category {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-category:hover {
  background-color: #0056b3;
}

.category-details {
  flex: 2;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.category-details h2 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
