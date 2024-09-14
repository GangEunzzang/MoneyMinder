<template>
  <div class="account-book-list">
    <h2>거래 내역</h2>

<!--    <div class="date-container">-->
<!--      <div class="date-icon" @click="toggleMonthSelect">-->
<!--        <font-awesome-icon icon="calendar-alt" class="icon-style"/>-->
<!--      </div>-->

<!--      <div v-if="selectedDate" class="selected-date-display">-->
<!--        {{ selectedYear }}년 {{ selectedMonth }}월-->
<!--      </div>-->

<!--      <div class="arrow-container">-->
<!--        <div class="arrow-up" @click="incrementMonth">-->
<!--          <font-awesome-icon icon="arrow-up"/>-->
<!--        </div>-->
<!--        <div class="arrow-down" @click="decrementMonth">-->
<!--          <font-awesome-icon icon="arrow-down"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 시작일 및 종료일 입력 필드 -->
    <div class="date-selector">
      <input type="date" id="startDate" v-model="startDate"/>
      ~
      <input type="date" id="endDate" v-model="endDate"/>
    </div>

    <!-- 검색 및 정렬 옵션 섹션 -->
    <div class="filter-sort">
      <input class="filter-search" type="text" v-model="searchQuery" placeholder="검색어 입력..."/>
      <select class="filter-type" v-model="categoryTypeFilter">
        <option value="">전체</option>
        <option value="INCOME">수입</option>
        <option value="EXPENSE">지출</option>
        <option value="ETC">기타</option>
      </select>
      <button @click="fetchAccountBooks(true)">검색</button>
    </div>

    <!-- 거래 내역 목록 -->
    <div class="transaction-list">
      <!-- 데이터가 없을 때 표시 -->
      <div v-if="filteredAndSortedBooks.length === 0" class="no-data">데이터가 없어요!</div>


      <div v-else>
        <div class="transaction-header">
<!--          <input type="checkbox" class="transaction-checkbox-header">-->
          <div class="transaction-date-header">날짜</div>
          <div class="transaction-category-header">카테고리</div>
          <div class="transaction-amount-header">금액</div>
          <div class="transaction-memo-header">상세내역</div>
          <div class="transaction-type-header">종류</div>
          <div class="transaction-actions-header">변경</div>
        </div>

        <div v-for="(book, index) in filteredAndSortedBooks" :key="index"
             @click="toggleSelection(book)"
             :class="{ selected: isSelected(book) }"
             class="transaction-card"
        >
<!--          <input type="checkbox" class="transaction-checkbox">-->
          <div class="transaction-date">{{ formatDateWithDay(book.transactionDate) }}</div>
          <div class="transaction-category">{{ book.categoryName }}</div>
          <div class="transaction-amount">{{ book.amount.toLocaleString() }}원</div>
          <div class="transaction-memo">{{ book.memo }}</div>
          <div class="transaction-type" :class="book.categoryType.toLowerCase()">
            <span v-if="book.categoryType === 'INCOME'">수입</span>
            <span v-else-if="book.categoryType === 'EXPENSE'">지출</span>
            <span v-else>기타</span>
          </div>
          <!-- 수정 및 삭제 이모티콘 추가 -->
          <div class="actions">
            <div class="action-icon" @click.stop="openEditModal(book)">
              ✏️
              <span class="tooltip">수정하기</span>
            </div>
            <div class="action-icon" @click.stop="deleteEntry(book.accountId)">
              🗑️
              <span class="tooltip">삭제하기</span>
            </div>
          </div>
        </div>
      </div>

    </div>

      <TransactionEditModal
        v-if="showEditModal"
        :isOpen="showEditModal"
        :bookToEdit="currentBookToEdit"
        @close="closeEditModal"
    />

    <TransactionRightSidebar/>

    <!-- 더보기 버튼 -->
    <div v-if="hasMoreData && filteredAndSortedBooks.length > 0" class="load-more">
      <button @click="fetchAccountBooks()">더보기</button>
    </div>
  </div>
</template>


<script>
import AccountBookAPI from "@/api/accountBook"; // 가계부 API 호출 함수 임포트
import TransactionEditModal from '@/components/transaction/TransactionEditModal.vue';
import TransactionRightSidebar from '@/components/transaction/TransactionRightSidebar.vue';

export default {
  components: {
    TransactionEditModal,
    TransactionRightSidebar
  },

  name: "AccountBookList",
  data() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return {
      accountBooks: [], // 서버에서 받아온 원본 데이터
      searchQuery: "", // 검색어
      sortKey: "transactionDate", // 기본 정렬 키
      sortOrder: "desc", // 기본 정렬 순서 (desc: 내림차순, asc: 오름차순)
      startDate: oneMonthAgo.toISOString().split("T")[0], // 기본 시작일 (한달 전)
      endDate: today.toISOString().split("T")[0], // 기본 종료일 (오늘)
      lastCursorId: null, // 페이징을 위한 마지막 커서 ID
      hasMoreData: true, // 더 가져올 데이터가 있는지 여부
      selectedBooks: [], // 선택된 항목들
      categoryTypeFilter: "", // 수입/지출 필터

      showEditModal: false, // 수정 모달 표시 여부
      currentBookToEdit: null // 수정할 항목 데이터
    };
  },
  computed: {
    filteredAndSortedBooks() {
      return this.accountBooks
      .filter(this.applyFilters)
      .sort(this.applySorting);
    }
  },

  created() {
    this.fetchAccountBooks(true); // 초기 로드 시 새 검색으로 호출
  },

  methods: {
    fetchAccountBooks(isNewSearch = false) {
      if (isNewSearch) {
        this.resetState();
      }

      // API 호출을 중복으로 하지 않도록 마지막 cursorId가 바뀔 때만 호출
      if (this.lastCursorId !== null || isNewSearch) {
        AccountBookAPI.getList(
            this.lastCursorId,
            this.searchQuery,
            this.startDate,
            this.endDate
        ).then((data) => {
          this.processFetchedData(data);
        }).catch((error) => {
          console.error('API 호출 오류:', error);
        });
      }
    },

    resetState() {
      this.lastCursorId = null;
      this.accountBooks = [];
      this.hasMoreData = true;
    },

    processFetchedData(data) {
      if (data.length > 0) {
        this.lastCursorId = data[data.length - 1].accountId;
        this.accountBooks = [...this.accountBooks, ...data]; // 기존 배열에 데이터를 추가
        this.hasMoreData = data.length >= 20; // 데이터가 20개 미만이면 더 이상 데이터가 없다고 판단
      } else {
        this.hasMoreData = false;
      }
    },

    applyFilters(book) {
      const matchesCategory = !this.categoryTypeFilter || book.categoryType
          === this.categoryTypeFilter;
      const matchesQuery = !this.searchQuery ||
          book.categoryName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.memo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.transactionDate.includes(this.searchQuery);

      return matchesCategory && matchesQuery;
    },

    applySorting(a, b) {
      const comparison = this.sortKey === "amount" ? b.amount - a.amount : new Date(
          b.transactionDate) - new Date(a.transactionDate);
      return this.sortOrder === "asc" ? comparison * -1 : comparison;
    },

    toggleSelection(book) {
      const index = this.selectedBooks.indexOf(book);
      if (index > -1) {
        this.selectedBooks.splice(index, 1);
      } else {
        this.selectedBooks.push(book);
      }
    },

    formatDateWithDay(dateStr) {
      const date = new Date(dateStr);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const day = days[date.getDay()];
      return `${dateStr} (${day})`;
    },

    isSelected(book) {
      return this.selectedBooks.includes(book);
    },

    // 수정 모달 오픈
    openEditModal(book) {
      this.showEditModal = true;
      this.currentBookToEdit = book;
    },

    // 수정 모달 닫기
    closeEditModal() {
      this.showEditModal = false;
      this.currentBookToEdit = null;
    },

    // 항목 삭제
    deleteEntry(accountBookId) {
      if (confirm('이 항목을 삭제하시겠습니까?')) {
        AccountBookAPI.deleteAccount(accountBookId)
        .then(() => {
          this.fetchAccountBooks(true);
        })
        .catch(error => {
          console.error('삭제 실패:', error);
        });
      }
    },
  },
};
</script>

<style scoped>
.account-book-list {
  background-color: #141418;
  color: white;
  padding: 1rem 5rem;
}

input[type='date'] {
  color: #ccc;
}

input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(100%); /* 아이콘을 흰색으로 변경 */
}

.date-selector, .filter-sort {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.date-selector input {
  padding: 0.8rem 1rem;
  border: 1px solid #4f4f4f;
  border-radius: 20px;
  font-size: 0.8rem;
  width: 8.5rem;
  transition: border-color 0.2s ease;
  background-color: #141418;
  color: #ccc;
}

.filter-search {
  padding: 0.8rem 1rem;
  border: 1px solid #4f4f4f;
  border-radius: 20px;
  font-size: 0.8rem;
  width: 8.5rem;
  transition: border-color 0.2s ease;
  background-color: #141418;
  color: #ccc;
}

.filter-type {
  padding: 0.8rem 1rem;
  border: 1px solid #4f4f4f;
  border-radius: 20px;
  font-size: 0.8rem;
  width: 7rem;
  transition: border-color 0.2s ease;
  background-color: #141418;
  color: #ccc;
}


.date-selector input:focus, .filter-sort input:focus, .filter-sort select:focus {
  border-color: #98aec2;
  outline: none;
}

.filter-sort {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter-sort button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.filter-sort button:hover {
  background-color: #0056b3;
}

.transaction-list {
  width: 65rem;
}

.transaction-header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: white;
  border-bottom: 1px solid #2a2a2a;
  border-top: 1px solid #2a2a2a;
}

.transaction-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: relative; /* Position relative 추가 */
}

.transaction-card:hover {
  background-color: rgba(59, 59, 59, 0.22);
}

.transaction-card.selected {
  background-color: rgba(40, 40, 40, 0.76);
}

.transaction-date {
  font-size: 0.8rem;
  font-weight: 300;
  color: #f5f5f5;
  flex: 1;
}

.transaction-date-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex: 1;
}

.transaction-category {
  font-size: 0.8rem;
  font-weight: 300;
  color: #f5f5f5;
  flex: 1;
}

.transaction-category-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex: 1;
}

.transaction-amount {
  font-size: 0.8rem;
  font-weight: 300;
  color: #dadada;
  flex: 1;
}

.transaction-amount-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex: 1;
}

.transaction-memo {
  font-size: 0.8rem;
  font-weight: 300;
  color: #dadada;
  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.transaction-memo-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex: 1;
}

.transaction-type {
  font-size: 0.8rem;
  font-weight: 300;
  border-radius: 12px;
  flex: 1.13;
}

.transaction-type-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex: 1;
}

.transaction-actions-header {
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 12px;
  color: white;
}

.transaction-type.income {
  color: #3481f0;
  font-weight: 500;
}

.transaction-type.expense {
  font-weight: 500;
  color: #ff0000;
}

.actions {
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
  right: 15px; /* right 속성을 조정하여 겹치지 않도록 설정 */
  top: 50%; /* 세로 가운데 정렬을 위해 top을 50%로 설정 */
  transform: translateY(-50%); /* 가운데 정렬을 위해 transform 추가 */
}

.transaction-card:hover .actions {
  opacity: 1; /* 호버 시 표시 */
}

.action-icon {
  position: relative;
  font-size: 0.8rem;
  cursor: pointer;
}

.action-icon .tooltip {
  visibility: hidden;
  width: 80px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* 위치 조정 */
  left: 50%;
  margin-left: -40px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 14px;
}

.action-icon:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more button {
  padding: 10px 20px;
  background-color: #5e7286;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.load-more button:hover {
  background-color: #b8cee3;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 20px 0;
}



</style>
