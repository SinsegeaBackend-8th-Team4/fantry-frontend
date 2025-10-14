// src/api/adminDashboard.js
import { apiClient } from './index';
import { unwrap, rethrow } from './InspectionHelper';

/**
 * 관리자 대시보드 요약 정보를 조회합니다.
 * (문의 현황, 정산 현황 등)
 * @returns {Promise<any>}
 */
export const getDashboardSummary = () => {
  return apiClient.get('/admin/dashboard/summary').then(res => res.data);
};
