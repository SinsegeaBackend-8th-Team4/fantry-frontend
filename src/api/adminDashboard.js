// src/api/adminDashboard.js
import { apiClient } from './index';
import { unwrap } from './InspectionHelper';

/**
 * 관리자 대시보드 요약 정보를 조회합니다.
 * @returns {Promise<DashboardSummaryResponse>}
 */
export const getDashboardSummary = () => {
  return unwrap(apiClient.get('/admin/dashboard/summary'));
};