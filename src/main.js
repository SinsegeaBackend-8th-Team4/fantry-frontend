import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// --- NPM으로 설치한 전역 라이브러리 임포트 ---

// 1. CSS 파일 (모든 페이지에서 공통으로 사용될 수 있는 스타일)
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

// 2. JavaScript 파일 (애플리케이션 전반에서 필요한 핵심 라이브러리)
import jQuery from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// jQuery를 window 객체에 할당하여 Bootstrap 및 기타 플러그인이 참조할 수 있도록 합니다.
window.$ = window.jQuery = jQuery;


// --- 애플리케이션 설정 ---

// Pinia (상태 관리 저장소) 인턴스 생성
const pinia = createPinia();

// Vue 앱 인스턴스 생성
const app = createApp(App);

// 플러그인 등록
app.use(router);
app.use(pinia);

// 앱 마운트
app.mount('#app');
