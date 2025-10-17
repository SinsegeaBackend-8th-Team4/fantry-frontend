import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useUiStore } from './stores/uiStore';
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'


// Global vendor CSS (순수 전역만)
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

// JS vendors (Bootstrap JS 는 전역 1회만)
import jQuery from 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'vue-toastification/dist/index.css'

// jQuery 의존 플러그인 호환성을 위해 전역에 설정
window.$ = window.jQuery = jQuery 

const app = createApp(App);
const pinia = createPinia(); // Pinia 인스턴스 생성

// 1. Vue Router와 Pinia를 앱에 등록
app.use(router);
app.use(pinia); 

// 2. Pinia가 설치된 후 uiStore 초기화 (네비게이션 가드에서 사용)
const uiStore = useUiStore();

// Vue Router Navigation Guards
router.beforeEach((to, from, next) => {
  uiStore.startLoading();
  next();
});

router.afterEach(() => {
  uiStore.stopLoading();
});


const toastOption = {
  position: 'top-right',
  timeout: 20000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

// 3. vue-toastification 등록 및 앱 마운트
app.use(Toast, toastOption)
app.mount('#app')