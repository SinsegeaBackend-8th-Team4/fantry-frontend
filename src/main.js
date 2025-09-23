import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Global vendor CSS (순수 전역만) - Bootstrap CSS는 각 레이아웃 SCSS에서 변수 적용 후 컴파일
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

// JS vendors (Bootstrap JS 는 전역 1회만)
import jQuery from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.$ = window.jQuery = jQuery; // jQuery 의존 플러그인 호환

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
