<!-- src/views/NotFoundPage.vue -->
<template>
  <div class="not-found-page">
    <div class="content-container">
      <h1 class="error-code">404</h1>
      <p class="error-message">페이지를 찾을 수 없습니다</p>
      <p class="error-description">
        요청하신 페이지는 존재하지 않거나, 이미 삭제되었습니다.
      </p>
      <router-link to="/" class="back-home-btn">
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212; /* 블랙톤 배경 */
  color: #ffffff;
}

.content-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  border-radius: 12px;
  background-color: #1e1e1e; /* 다크 그레이 톤의 배경 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* 어두운 그림자 */
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #f87c7d; /* 빨간색으로 강렬한 느낌 */
  margin-bottom: 1rem;
  animation: bounce 1.5s infinite;
}

.error-message {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff; /* 흰색으로 텍스트 강조 */
}

.error-description {
  font-size: 1.2rem;
  color: #b3b3b3; /* 다소 밝은 회색으로 부드러운 설명 */
  margin-bottom: 2rem;
}

.back-home-btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #121212;
  background-color: #ffd9da; /* 버튼을 빨간색으로 강조 */
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.back-home-btn:hover {
  background-color: #f38a8a;
  color: #ffffff; /* 호버 시 텍스트 색상 변경 */
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
