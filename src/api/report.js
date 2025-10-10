import { apiClient } from "./index.js";

const serverPath = import.meta.env.VITE_API_SERVER_URL;

/* -------------------------------------------------------------
    회원 신고
---------------------------------------------------------------*/
// 회원 신고 전체 조회
export const getAllReports = () => {
    return apiClient.get(serverPath + '/api/report/');
}

// 회원 한명에 대한 신고 조회
export const getReportsMember = (memberId) => {
    return apiClient.get(serverPath + `/api/report/member/${memberId}`);
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

// 회원 구제 신청 요청
export const setReceivedReport = (id) => {
    return apiClient.patch(serverPath + `/api/report/member/received`, null, {
        params: {
            reportId: id
        }
    });
}