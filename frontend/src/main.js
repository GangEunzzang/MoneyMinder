import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router를 임포트
import store from './store'; // Vuex 스토어 가져오기
import axios from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

let app = createApp(App)
    .use(store) // Vue 앱에 스토어 사용 등록
    .use(router) // Vue 앱에 라우터 사용 등록
    .use(axios) // Vue 앱에 axios 사용 등록

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');