import {apiClient, publicApiClient} from './index';

/* -------------------------------------------------------------
    로그인 
---------------------------------------------------------------*/
export const login = (id, pwd) => {
    return publicApiClient.post('/login', {
        username: id,
        password: pwd
    });
}

/* -------------------------------------------------------------
    회원 가입 
---------------------------------------------------------------*/
// 중복 아이디 체크
export const checkDuplicateUsername = (username) => {
    return publicApiClient.get('/user/checkId', {
        params: { id: username }
    });
}

// 회원 가입
export const signup = (payload, type) => {
    return publicApiClient.post(`/${type}/signup`, payload);
}


/* -------------------------------------------------------------
    인증 코드
---------------------------------------------------------------*/
// 인증코드 발송
 export const sendAuthCode = (email) => {
    return publicApiClient.post('/send/authCode', {
        email: email
    });
}

// 인증코드 검수
export const verifyAuthCode = (email, code) => {
    return publicApiClient.post('/user/verifyCode', {
        email: email,
        code: code
    });
}


/* -------------------------------------------------------------
    아이디 및 비밀번호 찾기 
---------------------------------------------------------------*/
// 아이디 가져오기
export const findUserId = (email) => {
    return publicApiClient.get('/user/findId', {
        params: { email }
    });
}

/* -------------------------------------------------------------
    로그아웃 처리
---------------------------------------------------------------*/
export const logout = () => {
    return apiClient.post('/logout');
}