// src/api/adminReturn.js
import { apiClient } from './index';

/**
 * 반품/환불 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - { page, size, sort, status, memberName, productName }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const searchReturns = (params) => {
  return apiClient.get('/admin/returns', { params });
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
