<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">더 스마트하게 가계부를 관리하세요</h1>
        <p class="hero-subtext">최신 디자인과 직관적인 인터페이스로 당신의 재정을 한 눈에.</p>
        <router-link to="/login" class="login-button">지금 시작하기</router-link>
      </div>
    </div>

    <!-- 소개 섹션 -->
    <div class="introduction-section">
      <!-- 대시보드 소개 -->
      <div class="section">
        <div class="intro-text">
          <h2>대시보드</h2>
          <p>수입과 지출, 예산 상태를 대시보드에서 한눈에 확인하세요.</p>
        </div>
        <div class="intro-image">
          <img src="@/assets/dashboard.png" alt="대시보드 이미지" class="responsive-image" />
        </div>
      </div>

      <!-- 거래내역 소개 -->
      <div class="section">
        <div class="intro-image">
          <img src="@/assets/transaction.png" alt="거래내역 이미지" class="responsive-image" />
        </div>
        <div class="intro-text">
          <h2>거래내역</h2>
          <p>수입과 지출 내역을 쉽게 기록하고 추적하며, 빠른 검색 기능을 제공합니다.</p>
        </div>
      </div>

      <!-- 예산 소개 -->
      <div class="section">
        <div class="intro-text">
          <h2>예산 관리</h2>
          <p>카테고리별로 예산을 설정하고, 실시간 지출 현황을 확인하세요.</p>
        </div>
        <div class="intro-image">
          <img src="@/assets/transaction.png" alt="예산 관리 이미지" class="responsive-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-in');
        }
      });
    });
    const targetSections = document.querySelectorAll('.section');
    targetSections.forEach(section => observer.observe(section));
  },
}
</script>

<style scoped>
/* General Page Layout */
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #121212;
  overflow-x: hidden;
  padding: 2rem 0;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #181818, #222222);
  height: 100vh;
  width: 100%;
  padding: 0 2rem;
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  text-transform: capitalize;
  animation: fadeInUp 1s ease-in-out;
}

.hero-subtext {
  font-size: 1.3rem;
  color: #bcbcbc;
  margin-bottom: 2.5rem;
}

.login-button {
  padding: 1rem 3rem;
  background-color: #ff7f50;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 40px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 10px 20px rgba(255, 127, 80, 0.6);
  animation: fadeInUp 1.5s ease-in-out;
}

.login-button:hover {
  background-color: #e96b39;
  transform: translateY(-4px);
}

/* Introduction Section */
.introduction-section {
  width: 90%;
  max-width: 1200px;
}

/* Each Section Layout */
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 2rem;
  background-color: #1e1e1e;
  border-radius: 15px;
  border: 1px solid #333333;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  visibility: hidden;
  transition: opacity 1.5s ease, transform 1.5s ease, visibility 1.5s;
}

.section:nth-child(even) {
  flex-direction: row-reverse;
}

.section:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
}

.intro-text {
  flex: 1;
  padding: 0 2rem;
  text-align: left;
}

.intro-text h2 {
  font-size: 2.4rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 800;
  line-height: 1.3;
}

.intro-text p {
  font-size: 1.1rem;
  color: #bcbcbc;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.intro-image {
  flex: 1;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
}

.responsive-image {
  width: 100%;
  max-width: 550px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.responsive-image:hover {
  transform: scale(1.05);
}

/* Scroll Triggered Animations */
.scroll-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
  visibility: visible !important;
}

/* Animations */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
