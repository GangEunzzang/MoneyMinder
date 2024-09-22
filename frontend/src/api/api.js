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


instance.interceptors.response.use(
    response => response,
    async error => {
        const {config, response: {data: {code}}} = error;

        if (code !== 2002 || !config.url.includes(REFRESH_URL), config.sent) {
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
            console.warm("토큰이 없습니다.");
        }
    }
    return instance;
}

export default api;
