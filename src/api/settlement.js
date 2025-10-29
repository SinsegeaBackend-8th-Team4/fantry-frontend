// src/api/settlement.js
<<<<<<< HEAD
import {apiClient} from './index';
import { unwrap } from './InspectionHelper';

/* ==================================================================================
 * 정산 관련 API (사용자용)
 * ================================================================================== */

/**
 * 나의 정산 내역 목록을 페이징하여 조회합니다.
 * @param {object} params - 페이징 정보 { page, size, sort }
 * @returns {Promise<Page<SettlementSummaryResponse>>}
 */
export const getMySettlements = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0,
    size: params.size,
    sort: params.sort,
  };
  return unwrap(apiClient.get('/my/settlements', { params: queryParams }));
};

/**
 * 나의 특정 정산 건의 상세 내역을 조회합니다.
 * @param {number} settlementId - 조회할 정산 ID
 * @returns {Promise<SettlementDetailResponse>}
 */
export const getMySettlementDetail = (settlementId) => {
  return unwrap(apiClient.get(`/my/settlements/${settlementId}`));
};
=======
import apiClient from './index'; // 중앙 설정된 apiClient import

/**
 * 정산 목록 데이터를 서버에 요청합니다.
 * @returns {Promise} Axios Promise 객체
 */
export const getSettlements = () => {
  return apiClient.get('/settlements');
};

/**
 * 특정 ID의 정산 상세 데이터를 서버에 요청합니다.
 * @param {string | number} id - 조회할 정산 데이터의 ID
 * @returns {Promise} Axios Promise 객체
 */
export const getSettlementById = (id) => {
  return apiClient.get(`/settlements/${id}`);
};

/**
 * 월별 정산 요약 데이터를 서버에 요청합니다. (차트용)
 * @returns {Promise} Axios Promise 객체
 */
export const getMonthlySettlementSummary = () => {
  return apiClient.get('/settlements/monthly-summary');
};

// TODO: POST(생성), PUT(수정), DELETE(삭제) 등 다른 API 함수들도 필요에 따라 추가
>>>>>>> origin/main
