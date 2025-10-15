// src/api/settlement.js
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