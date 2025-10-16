// src/api/adminSettlement.js
import { apiClient } from './index';
import { unwrap } from './InspectionHelper';

/* ==================================================================================
 * 어드민 - 정산 관리 API
 * ================================================================================== */

/**
 * 대시보드에 표시될 정산 KPI 요약 정보를 조회합니다.
 * @returns {Promise<SettlementDashboardResponse>}
 */
export const getSettlementDashboardSummary = () => {
  return unwrap(apiClient.get('/admin/settlement/dashboard'));
};

/**
 * 정산 내역 목록을 검색 조건과 함께 페이징하여 조회합니다.
 * @param {object} params - 검색 조건 및 페이징 정보
 * @param {string} [params.sellerName] - 판매자 이름
 * @param {string} [params.status] - 정산 상태 (예: PENDING, COMPLETED)
 * @param {string} [params.startDate] - 시작 날짜 (YYYY-MM-DD)
 * @param {string} [params.endDate] - 종료 날짜 (YYYY-MM-DD)
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'requestedAt,desc')
 * @returns {Promise<Page<SettlementSummaryResponse>>}
 */
export const getAdminSettlements = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0,
    size: params.size,
    sort: params.sort,
    sellerName: params.sellerName,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
  };
  return unwrap(apiClient.get('/admin/settlement', { params: queryParams }));
};

/**
 * 특정 정산 건의 상세 내역을 조회합니다.
 * @param {number} settlementId - 정산 ID
 * @returns {Promise<SettlementDetailResponse>}
 */
export const getAdminSettlementDetail = (settlementId) => {
  return unwrap(apiClient.get(`/admin/settlement/${settlementId}`));
};

/**
 * 현재 적용 중인 정산 설정을 조회합니다.
 * @returns {Promise<SettlementSettingResponse>}
 */
export const getSettlementSettings = () => {
  return unwrap(apiClient.get('/admin/settlement/settings'));
};

/**
 * 정산 설정을 생성하거나 수정합니다.
 * @param {object} payload - SettlementSettingRequest
 * @param {number} payload.commissionRate - 수수료율 (필수, 0.0 이상 100.0 이하)
 * @param {string} payload.settlementCycleType - 정산 주기 타입 (WEEKLY, MONTHLY) (필수)
 * @param {number} [payload.settlementDay] - 정산 일 (주간: 요일, 월간: 일)
 * @returns {Promise<SettlementSettingResponse>}
 */
export const createOrUpdateSettlementSettings = (payload) => {
  return apiClient.post('/admin/settlement/settings', payload);
};
