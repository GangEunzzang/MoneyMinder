import axios from 'axios';

// Toast 알림 기능은 main.js 또는 다른 Vue 컴포넌트에서 사용

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

instance.interceptors.response.use(
    response => response,
    error => {
      const errorMsg = error.response?.data?.message || 'An unknown error occurred';
      console.error('API Error:', errorMsg);
      // Toast 알림은 여기서 바로 사용하지 않고 에러 메시지를 반환
      return Promise.reject(error);
    }
);

export function api(isAuthenticated = false) {
  if (isAuthenticated) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No access token found. Authorization header will not be set.');
    }
  }
  return instance;
}

export default api;
