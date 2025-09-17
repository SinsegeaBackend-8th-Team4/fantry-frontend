import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// --- NPM으로 설치한 라이브러리 임포트 ---
// 1. Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

// 2. DataTables CSS (Bootstrap 5 테마)
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

// 3. jQuery 및 기타 전역 라이브러리 설정
// Vite는 모듈 기반으로 동작하므로, jQuery와 같은 라이브러리를
// 전역(window) 객체에 명시적으로 할당해야 기존 템플릿 스크립트가 인식할 수 있습니다.
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

// --- 애플리케이션 설정 ---

// Pinia (상태 관리 저장소) 인스턴스 생성
const pinia = createPinia();

// Vue 앱 인스턴스 생성
const app = createApp(App);

// 플러그인 등록
app.use(router);
app.use(pinia);

// 앱 마운트
app.mount('#app');
