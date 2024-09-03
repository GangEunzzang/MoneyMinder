import { createStore } from 'vuex';
import axios from 'axios';

`const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:8080",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
        async refreshTokens({ commit, dispatch, state }) {
            try {
                const response = await api.post('/api/auth/reissue', `refreshToken=${state.refreshToken}`);
                const { accessToken, refreshToken } = response.data.data;

                await dispatch('saveTokens', { accessToken, refreshToken });

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


