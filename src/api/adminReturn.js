// src/api/adminReturn.js
<<<<<<< HEAD
import { apiClient } from './index'; // instance 대신 apiClient 사용

/* ==================================================================================
 * 어드민 - 환불/반품 관리 API
 * ================================================================================== */
=======
<<<<<<< HEAD
import { apiClient } from './index';
>>>>>>> develop

/**
 * 환불/반품 요청 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건 및 페이징 정보
 * @param {string} [params.status] - 검색할 처리 상태 (REQUESTED, IN_TRANSIT, INSPECTING, APPROVED, REJECTED, COMPLETED, USER_CANCELLED, DELETED)
 * @param {string} [params.buyerName] - 검색할 구매자 이름 (부분 일치)
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'requestedAt,desc')
 * @returns {Promise<Page<ReturnSummaryResponse>>}
 */
export const getAdminReturnList = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
    size: params.size,
    sort: params.sort,
    status: params.status,
    buyerName: params.buyerName,
  };
  return apiClient.get('/admin/returns', { params: queryParams });
};

/**
 * 특정 환불/반품 요청의 상세 정보를 조회합니다.
 * @param {number} returnRequestId - 조회할 환불/반품 요청의 ID
 * @returns {Promise<ReturnAdminResponse>}
 */
<<<<<<< HEAD
export const getAdminReturnDetail = (returnRequestId) => {
=======
export const getReturnById = (returnRequestId) => {
=======
import { apiClient } from './index'; // instance 대신 apiClient 사용

/* ==================================================================================
 * 어드민 - 환불/반품 관리 API
 * ================================================================================== */

/**
 * 환불/반품 요청 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건 및 페이징 정보
 * @param {string} [params.status] - 검색할 처리 상태 (REQUESTED, IN_TRANSIT, INSPECTING, APPROVED, REJECTED, COMPLETED, USER_CANCELLED, DELETED)
 * @param {string} [params.buyerName] - 검색할 구매자 이름 (부분 일치)
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'requestedAt,desc')
 * @returns {Promise<Page<ReturnSummaryResponse>>}
 */
export const getAdminReturnList = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
    size: params.size,
    sort: params.sort,
    status: params.status,
    buyerName: params.buyerName,
  };
  return apiClient.get('/admin/returns', { params: queryParams });
};

/**
 * 특정 환불/반품 요청의 상세 정보를 조회합니다.
 * @param {number} returnRequestId - 조회할 환불/반품 요청의 ID
 * @returns {Promise<ReturnAdminResponse>}
 */
export const getAdminReturnDetail = (returnRequestId) => {
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
  return apiClient.get(`/admin/returns/${returnRequestId}`);
};

/**
<<<<<<< HEAD
 * 관리자가 사용자를 대신하여 환불/반품 요청을 생성합니다.
 * @param {object} returnData - ReturnAdminCreateRequest
 * @param {string} returnData.orderId - 주문 ID (필수)
 * @param {number} returnData.memberId - 회원 ID (필수)
 * @param {string} returnData.reason - 환불/반품 사유 (SIMPLE_CHANGE_OF_MIND, PRODUCT_DEFECT, SHIPPING_ERROR, ETC) (필수)
 * @param {string} [returnData.detailReason] - 상세 사유
 * @returns {Promise<ReturnAdminResponse>}
=======
<<<<<<< HEAD
 * 특정 반품/환불 요청의 상태를 변경합니다.
 * @param {number} returnRequestId - 상태를 변경할 반품 ID
 * @param {object} payload - { status, reason }
 * @returns {Promise<axios.AxiosResponse<any>>}
>>>>>>> develop
 */
export const createAdminReturn = (returnData) => {
  return apiClient.post('/admin/returns', returnData);
};
<<<<<<< HEAD
=======
=======
 * 관리자가 사용자를 대신하여 환불/반품 요청을 생성합니다.
 * @param {object} returnData - ReturnAdminCreateRequest
 * @param {string} returnData.orderId - 주문 ID (필수)
 * @param {number} returnData.memberId - 회원 ID (필수)
 * @param {string} returnData.reason - 환불/반품 사유 (SIMPLE_CHANGE_OF_MIND, PRODUCT_DEFECT, SHIPPING_ERROR, ETC) (필수)
 * @param {string} [returnData.detailReason] - 상세 사유
 * @returns {Promise<ReturnAdminResponse>}
 */
export const createAdminReturn = (returnData) => {
  return apiClient.post('/admin/returns', returnData);
};
>>>>>>> develop

/**
 * 특정 환불/반품 요청의 상태를 변경하고 관련 정보를 업데이트합니다.
 * @param {number} returnRequestId - 처리할 환불/반품 요청의 ID
 * @param {object} returnData - ReturnAdminUpdateRequest
 * @param {string} returnData.status - 변경할 상태 (REQUESTED, IN_TRANSIT, INSPECTING, APPROVED, REJECTED, COMPLETED) (필수)
 * @param {number} [returnData.deductedShippingFee] - 차감 배송비
 * @param {string} [returnData.rejectReason] - 거절 사유 (REJECTED 상태일 경우 필요)
 * @param {string} [returnData.memo] - 관리자 메모
 * @returns {Promise<ReturnAdminResponse>}
 */
export const updateAdminReturn = (returnRequestId, returnData) => {
  return apiClient.patch(`/admin/returns/${returnRequestId}`, returnData);
};

/**
 * 관리자가 환불/반품 요청을 논리적으로 삭제합니다.
 * @param {number} returnRequestId - 삭제할 환불/반품 요청의 ID
 * @returns {Promise<void>}
 */
export const deleteAdminReturn = (returnRequestId) => {
  return apiClient.delete(`/admin/returns/${returnRequestId}`);
<<<<<<< HEAD
};
=======
};
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
>>>>>>> develop
