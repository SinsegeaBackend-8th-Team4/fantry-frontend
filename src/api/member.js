import { apiClient } from "./index.js";

const serverPath = import.meta.env.VITE_API_SERVER_URL;

/* -------------------------------------------------------------
    회원 정보
---------------------------------------------------------------*/
// 회원 정보 전체 조회
export const getAllMembers = () => {
    return apiClient.get(serverPath + '/api/member/',);
}

// 회원 상세 정보 조회
export const getMemberDetail = (memberId) => {
    return apiClient.get(serverPath + `/api/member/${memberId}`);
}

// 회원 등록
export const registMember = (payload) => {
    return apiClient.post(serverPath + '/api/member/', payload);
}

// 회원 정보 수정
export const updateOneMember = (memberId, payload) => {
    return apiClient.put(serverPath + `/api/member/${memberId}`, payload);
}

// 회원 삭제
export const deleteOneMember = (memberId) => {
    return apiClient.delete(serverPath + `/api/member/${memberId}`);
}

// 회원 삭제(플래그 변경)
export const deactiveateMember = (memberId) => {
    return apiClient.put(serverPath + `/api/member/${memberId}/delete`);
}

// 회원 복구(토큰으로 회원 조회)
export const getMemberByToken = () => {
    return apiClient.get(serverPath + '/api/member/me');
}

// 비밀번호로 회원 인증
export const verifyMemberPassword = (id, password) => {
    return apiClient.get(serverPath + `/api/member/${id}/verifyPassword`, {
        params: { password }
    });
}

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