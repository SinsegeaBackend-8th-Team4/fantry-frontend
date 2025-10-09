import { apiClient } from "./index.js";

const serverPath = import.meta.env.VITE_API_SERVER_URL;


// 계좌 전체 리스트 가져오기
export const getAllAccounts = () => {
    return apiClient.get(serverPath + '/api/account/');
}

// 한명의 회원에 대한 모든 계좌 정보
export const getAccountsMember = (memberId) => {
    return apiClient.get(`${serverPath}/api/account/member/${memberId}`);
}

// 계좌 하나 정보 가져오기
export const getAccount = (accountId) => {
    return apiClient.get(`${serverPath}/api/account/${accountId}`);
}

// 계좌 추가하기
export const addAccount = (payload) => {
    return apiClient.post(`${serverPath}/api/account/`, payload);
}

// 계좌 삭제하기
export const deleteAccount = (accountId) => {
    return apiClient.delete(`${serverPath}/api/account/${accountId}`);
}