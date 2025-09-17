// src/api/index.js
import axios from 'axios';

// Axios 클라이언트 인스턴스 생성
const apiClient = axios.create({
  /**
   * API 서버의 기본 URL을 설정합니다.
   * - 로컬 개발 환경에서는 Vite의 프록시 설정을 통해 '/api' 요청을 백엔드 서버로 전달합니다.
   * - .env 파일 등을 통해 환경별로 다른 URL을 주입하는 것이 이상적입니다.
   */
  baseURL: '/api',

  /**
   * 요청 타임아웃을 10초로 설정합니다.
   * 이 시간 내에 서버로부터 응답을 받지 못하면 요청은 실패 처리됩니다.
   */
  timeout: 10000,

  /**
   * 요청 헤더의 기본값을 설정합니다.
   * 모든 요청에 'Content-Type'으로 'application/json'을 포함시킵니다.
   */
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * 요청 인터셉터 (Request Interceptor)
 * - 모든 API 요청이 서버로 전송되기 전에 가로채어 특정 작업을 수행합니다.
 * - 예: 요청 헤더에 인증 토큰(JWT)을 추가합니다.
 */
apiClient.interceptors.request.use(
  config => {
    // TODO: Pinia 스토어 등에서 로그인 토큰을 가져와 헤더에 추가하는 로직 구현
    // const token = userStore.token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    // 요청 설정 중 발생한 에러 처리
    return Promise.reject(error);
  }
);

/*
 * 응답 인터셉터 (Response Interceptor)
 * - 서버로부터 응답을 받은 후, .then() 또는 .catch()로 처리되기 전에 가로챕니다.
 * - 예: 응답 데이터의 공통 형식을 처리하거나, 401 Unauthorized 에러 시 자동으로 로그아웃 처리
 */
apiClient.interceptors.response.use(
  response => {
    // 서버로부터 받은 응답 데이터를 그대로 반환합니다.
    return response;
  },
  error => {
    // TODO: 응답 상태 코드에 따른 공통 에러 처리 로직 구현
    // if (error.response && error.response.status === 401) {
    //   // 로그아웃 처리 또는 토큰 갱신 로직
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
