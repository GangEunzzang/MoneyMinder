import { createStore } from 'vuex';
import axios from 'axios';

// Axios 인스턴스를 생성하여 인터셉터 추가
const api = axios.create({
  baseURL: 'https://your-api-url.com', // API의 기본 URL
});

export default createStore({
  state: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    isLoggedIn: !!localStorage.getItem('accessToken'),
  },
  mutations: {
    SET_TOKENS(state, { accessToken, refreshToken }) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoggedIn = !!accessToken;
    },
    LOGOUT(state) {
      state.accessToken = '';
      state.refreshToken = '';
      state.isLoggedIn = false;
    },
  },
  actions: {
    saveTokens({ commit }, { accessToken, refreshToken }) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      commit('SET_TOKENS', { accessToken, refreshToken });
    },
    logout({ commit }) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      commit('LOGOUT');
    },
    async refreshTokens({ commit, state }) {
      try {
        const response = await api.post('/auth/refresh-token', {
          refreshToken: state.refreshToken,
        });
        const { accessToken, refreshToken } = response.data;
        commit('SET_TOKENS', { accessToken, refreshToken });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return accessToken;
      } catch (error) {
        commit('LOGOUT');
        throw new Error('리프레시 토큰이 만료되었거나 유효하지 않습니다.');
      }
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
});

// Axios 요청 인터셉터
api.interceptors.request.use(
    async (config) => {
      const store = require('@/store').default; // Vuex 스토어 가져오기
      let accessToken = store.state.accessToken;

      // 요청 전에 토큰이 만료되었는지 확인하는 로직 추가
      if (accessToken) {
        // 예시: 토큰이 만료되었는지 확인하기 위한 조건 (로직은 실제 요구에 맞게 조정)
        const isTokenExpired = false; // 여기에 토큰 만료 확인 로직을 추가

        if (isTokenExpired) {
          accessToken = await store.dispatch('refreshTokens');
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
);

