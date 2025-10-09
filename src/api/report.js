import { apiClient } from "./index.js";

const serverPath = import.meta.env.VITE_API_SERVER_URL;

/* -------------------------------------------------------------
    회원 신고
---------------------------------------------------------------*/
// 회원 신고 전체 조회
export const getAllReports = () => {
    return apiClient.get(serverPath + '/api/report/');
}

// 회원 신고 상세 조회
export const getReportDetail = (reportId) => {
    return apiClient.get(serverPath + `/api/report/${reportId}`);
}

// 구제 신청 전체 조회
export const getAllReceiveReports = () => {
    return apiClient.get(serverPath + '/api/report/received');
}

// 회원 신고 등록
export const registReport = (payload) => {
    return apiClient.post(serverPath + '/api/report/', payload);
}

// 회원 신고 구제 신청
export const updateReceiveReport = (reportId, payload) => {
    return apiClient.put(serverPath + `/api/report/${reportId}`, payload);
}