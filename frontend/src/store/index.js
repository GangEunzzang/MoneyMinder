import { createStore } from 'vuex';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        CLEAR_TOKENS(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.isLoggedIn = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
    actions: {
        saveTokens({ commit }, tokens) {
            commit('SET_TOKENS', tokens);
        },
        logout({ commit }) {
            commit('CLEAR_TOKENS');
        },
        async refreshTokens({ commit, dispatch, state }) {
            try {
                const response = await api.post(
                    '/api/auth/reissue',
                    `refreshToken=${state.refreshToken}`
                );
                if (response.status === 403 && response.data.code === 2002) {
                    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                    commit('CLEAR_TOKENS');
                    // this.$router.push({ name: 'login' });
                    return;
                }

                const { accessToken, refreshToken } = response.data.data;
                dispatch('saveTokens', { accessToken, refreshToken });

                return accessToken;
            } catch (error) {
                console.error('리프레시 토큰 갱신 중 오류 발생:', error);
                dispatch('logout');
                throw new Error('리프레시 토큰이 만료되었거나 유효하지 않습니다.');
            }
        },
    },
    getters: {
        isLoggedIn: (state) => state.isLoggedIn,
    },
});
