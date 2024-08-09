import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router를 임포트

createApp(App)
    .use(router) // Vue 앱에 라우터 사용 등록
    .mount('#app');
