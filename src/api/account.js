import { apiClient } from "./index.js";

// 계좌 전체 리스트 가져오기
export const getAllAccounts = () => {
    return apiClient.get('/account/');
}

// 한명의 회원에 대한 모든 계좌 정보
export const getAccountsMember = (memberId) => {
    return apiClient.get(`/account/member/${memberId}`);
}

// 계좌 하나 정보 가져오기
export const getAccount = (accountId) => {
    return apiClient.get(`/account/${accountId}`);
}

// 계좌 추가하기
export const addAccount = (payload) => {
    return apiClient.post(`/account/`, payload);
}

// 계좌 삭제하기
export const deleteAccount = (accountId) => {
    return apiClient.delete(`/account/${accountId}`);
}