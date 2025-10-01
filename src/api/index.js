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

  // 쿠키(Http를 사용하는 인증이 필요
  withCredentials: true,
});

// 토큰 갱신이 완료되면 대기열 요청들을 처리
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);  // 새로운 토큰으로 요청 재시도
    }
  });
  failedQueue = [];
};

/*
 * 요청 인터셉터 (Request Interceptor)
 * - 모든 API 요청이 서버로 전송되기 전에 가로채어 특정 작업을 수행합니다.
 * - 예: 요청 헤더에 인증 토큰(JWT)을 추가합니다.
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    return response;  // 정상 응답은 그대로 반환
  },
  // 400번대 이상 오류 발생 시 처리
  async error => {
    const originalRequest = error.config;

    // 로그아웃 요청이 401 에러를 반환하는 경우, 토큰 갱신 로직을 실행하지 않고 즉시 로그아웃 처리합니다.
    // if (originalRequest.url.includes('/logout')) {
    //   localStorage.removeItem('accessToken');
    //   // 이 부분에서 로그인 페이지로 리디렉션하거나 앱 상태를 초기화할 수 있습니다.
    //   // 예: window.location.href = '/login';
    //   return Promise.reject(error);
    // }

    // 1. 401 Unauthorized 에러이고, 토큰 갱신 시도가 아직 없는 경우
    if(error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // accessToken 재발급
      if (!isRefreshing) {
        isRefreshing = true;
        try{
          // 재발급 API 호출
          const serverPath = import.meta.env.VITE_API_SERVER_URL;
          const res = await axios.post(serverPath+'/api/reissue', null, {
            withCredentials: true
          });
          
          console.log("새로운 AccessToken : "+res);
          const newAccessToken = res.data.accessToken;

          // 로컬 스토리지에 새로운 토큰 저장 + 큐 처리
          localStorage.setItem('accessToken', newAccessToken);
          isRefreshing = false;

          // 대기열 요청들에 새로운 토큰으로 재시도 명령
          processQueue(null, newAccessToken);

          // 실패했던 원래 요청에 새로운 토큰으로 재시도
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
          return apiClient(originalRequest);
        }catch(err){
          // Refresh 토큰도 만료된 경우
          isRefreshing = false;
          processQueue(err, null);
          // 재발급 실패 시 로그아웃 처리
          const isLoggingOut = window.location.pathname === '/' || window.location.pathname === '/logout';
          localStorage.removeItem('accessToken');
          if(!isLoggingOut){
            window.location.href = '/login';
          }
          return Promise.reject(err);
        }
      }

      // 토큰 재발급이 진행 중인 경우, 요청을 대기열에 추가
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        // 토큰 재발급이 완료되면 대기열 요청을 새로운 토큰으로 재시도
        originalRequest.headers.Authorization = 'Bearer ' + token;
        return apiClient(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }
    return Promise.reject(error);
  }
);

// 로그인이 필요없는 API 요청을 위한 별도 Axios 인스턴스
const publicApiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export {apiClient, publicApiClient};
