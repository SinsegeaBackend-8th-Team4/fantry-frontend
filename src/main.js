import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useUiStore } from './stores/uiStore'; // Import useUiStore

// Global vendor CSS (순수 전역만) - Bootstrap CSS는 각 레이아웃 SCSS에서 변수 적용 후 컴파일
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

// JS vendors (Bootstrap JS 는 전역 1회만)
import jQuery from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.$ = window.jQuery = jQuery; // jQuery 의존 플러그인 호환

const app = createApp(App);
const pinia = createPinia(); // Create pinia instance
app.use(router);
app.use(pinia); // Use pinia instance

// Initialize uiStore after pinia is installed
const uiStore = useUiStore();

// Vue Router Navigation Guards
router.beforeEach((to, from, next) => {
  uiStore.startLoading();
  next();
});

router.afterEach(() => {
  uiStore.stopLoading();
});

app.mount('#app');
