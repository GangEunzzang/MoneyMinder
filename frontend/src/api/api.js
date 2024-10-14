import axios from 'axios';
import store from '@/store';
import mem from 'mem';

const REFRESH_URL = "/api/auth/reissue/";

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

const getRefreshToken = mem(async () => {
    try {
        let accessToken = await store.dispatch('refreshTokens');
        return accessToken;
    } catch (e) {
        store.dispatch('logout');
    }
}, {maxAge: 1000});

const EXCLUDED_URLS = ["/api/v1/user/login", "/api/v1/user/signup"];

instance.interceptors.response.use(
    response => response,
    async error => {
        const { config, response: { data: { code } } } = error;

        // 토큰 재발급이 필요하지 않은 URL인 경우 그냥 에러 반환
        if (EXCLUDED_URLS.some(url => config.url.includes(url))) {
            return Promise.reject(error);
        }

        // 기존 조건에 따라 토큰 재발급 요청 진행
        if (code !== 2002 || !config.url.includes(REFRESH_URL) || config.sent) {
            return Promise.reject(error);
        }

        config.sent = true;
        let accessToken = await getRefreshToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return axios(config);
        }

        return Promise.reject(error);
    }
);

export function api(isAuthenticated = false) {
    if (isAuthenticated) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn("토큰이 없습니다.");
        }
    }
    return instance;
}

export default api;
