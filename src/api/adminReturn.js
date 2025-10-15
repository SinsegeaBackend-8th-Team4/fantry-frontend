// src/api/adminReturn.js
import { instance } from './index';

// 반품/환불 목록 조회
export const getAdminReturnList = params => {
  return instance.get('/api/admin/returns', { params });
};

// 반품/환불 상세 조회
export const getAdminReturnDetail = returnRequestId => {
  return instance.get(`/api/admin/returns/${returnRequestId}`);
};

// 반품/환불 생성 (관리자용)
export const createAdminReturn = returnData => {
  return instance.post('/api/admin/returns', returnData);
};

// 반품/환불 수정
export const updateAdminReturn = (returnRequestId, returnData) => {
  return instance.put(`/api/admin/returns/${returnRequestId}`, returnData);
};

// 반품/환불 삭제
export const deleteAdminReturn = returnRequestId => {
  return instance.delete(`/api/admin/returns/${returnRequestId}`);
};

// 반품/환불 상태 변경
export const updateAdminReturnStatus = (returnRequestId, statusData) => {
  return instance.put(
    `/api/admin/returns/${returnRequestId}/status`,
    statusData,
  );
};


/**
 * 특정 ID의 반품/환불 상세 정보를 조회합니다.
 * @param {number} returnRequestId - 조회할 반품 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getReturnById = (returnRequestId) => {
  return apiClient.get(`/admin/returns/${returnRequestId}`);
};

/**
 * 특정 반품/환불 요청의 상태를 변경합니다.
 * @param {number} returnRequestId - 상태를 변경할 반품 ID
 * @param {object} payload - { status, reason }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateReturnStatus = (returnRequestId, payload) => {
  return apiClient.patch(`/admin/returns/${returnRequestId}`, payload);
};

/**
 * 반품/환불 상태별 통계를 조회합니다. (어드민 대시보드용)
 * @returns {Promise<object>}
 */
export const getReturnStats = () => {
  // 현재 반품/환불 통계 API가 별도로 없으므로, 임시로 빈 객체를 반환합니다.
  // 대시보드 요약 정보는 getDashboardSummary()를 통해 가져옵니다.
  return Promise.resolve({});
};
