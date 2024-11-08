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
        throw e; // 에러를 다시 던짐
    }
}, {maxAge: 1000});

const EXCLUDED_URLS = ["/api/v1/user/login", "/api/v1/user/signup"];

instance.interceptors.response.use(
    response => response,
    async error => {
        // 에러 객체의 구조 분해
        const { config } = error;
        const code = error.response?.data?.code;

        // 예외 URL 처리
        if (EXCLUDED_URLS.some(url => config.url.includes(url))) {
            return Promise.reject(error);
        }

        // 토큰 재발급 시도 여부 결정
        if (code !== 2002 || config.url.includes(REFRESH_URL) || config.sent) {
            return Promise.reject(error);
        }

        config.sent = true;

        try {
            let accessToken = await getRefreshToken();

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                return instance(config); // instance 사용
            } else {
                // 로그아웃 처리됨
                return Promise.reject(error);
            }
        } catch (e) {
            // 로그아웃 처리 후 에러 반환
            return Promise.reject(e);
        }
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
