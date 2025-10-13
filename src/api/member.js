import { apiClient } from "./index.js";

/* -------------------------------------------------------------
    회원 정보
---------------------------------------------------------------*/
// 회원 정보 전체 조회
export const getAllMembers = () => {
    return apiClient.get('/member/',);
}

// 회원 상세 정보 조회
export const getMemberDetail = (memberId) => {
    return apiClient.get(`/member/${memberId}`);
}

// 회원 등록
export const registMember = (payload) => {
    return apiClient.post('/member/', payload);
}

// 회원 정보 수정
export const updateOneMember = (memberId, payload) => {
    return apiClient.put(`/member/${memberId}`, payload);
}

// 회원 삭제
export const deleteOneMember = (memberId) => {
    return apiClient.delete(`/member/${memberId}`);
}

// 회원 삭제(플래그 변경)
export const deactiveateMember = (memberId) => {
    return apiClient.put(`/member/${memberId}/delete`);
}

// 회원 복구(토큰으로 회원 조회)
export const getMemberByToken = () => {
    return apiClient.get('/member/me');
}

// 비밀번호로 회원 인증
export const verifyMemberPassword = (id, password) => {
    return apiClient.get(`/member/${id}/verifyPassword`, {
        params: { password }
    });
}