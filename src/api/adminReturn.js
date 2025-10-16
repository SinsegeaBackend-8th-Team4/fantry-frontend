// src/api/adminReturn.js
import { apiClient } from './index';
import { unwrap } from './InspectionHelper';

/* ==================================================================================
 * 어드민 - 환불/반품 관리 API
 * ================================================================================== */

/**
 * 환불/반품 요청 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건 및 페이징 정보
 * @returns {Promise<Page<ReturnSummaryResponse>>}
 */
export const getAdminReturnList = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0,
    size: params.size,
    sort: params.sort,
    status: params.status,
    buyerName: params.buyerName,
  };
  return unwrap(apiClient.get('/admin/returns', { params: queryParams }));
};

/**
 * 특정 환불/반품 요청의 상세 정보를 조회합니다.
 * @param {number} returnRequestId - 조회할 환불/반품 요청의 ID
 * @returns {Promise<ReturnAdminResponse>}
 */
export const getAdminReturnDetail = (returnRequestId) => {
  return unwrap(apiClient.get(`/admin/returns/${returnRequestId}`));
};

/**
 * 관리자가 사용자를 대신하여 환불/반품 요청을 생성합니다.
 * @param {object} returnData - ReturnAdminCreateRequest
 * @returns {Promise<ReturnAdminResponse>}
 */
export const createAdminReturn = (returnData) => {
  return unwrap(apiClient.post('/admin/returns', returnData));
};

/**
 * 특정 환불/반품 요청의 상태를 변경하고 관련 정보를 업데이트합니다.
 * @param {number} returnRequestId - 처리할 환불/반품 요청의 ID
 * @param {object} returnData - ReturnAdminUpdateRequest
 * @returns {Promise<ReturnAdminResponse>}
 */
export const updateAdminReturn = (returnRequestId, returnData) => {
  return unwrap(apiClient.patch(`/admin/returns/${returnRequestId}`, returnData));
};

/**
 * 관리자가 환불/반품 요청을 논리적으로 삭제합니다.
 * @param {number} returnRequestId - 삭제할 환불/반품 요청의 ID
 * @returns {Promise<void>}
 */
export const deleteAdminReturn = (returnRequestId) => {
  return unwrap(apiClient.delete(`/admin/returns/${returnRequestId}`));
};