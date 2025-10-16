// src/api/adminDashboard.js
import { apiClient } from './index';
<<<<<<< HEAD
import { unwrap, rethrow } from './InspectionHelper';

/**
 * 관리자 대시보드 요약 정보를 조회합니다.
 * (문의 현황, 정산 현황 등)
 * @returns {Promise<any>}
 */
export const getDashboardSummary = () => {
  return apiClient.get('/admin/dashboard/summary').then(res => res.data);
};
=======
import { unwrap } from './InspectionHelper';

/**
 * 관리자 대시보드 요약 정보를 조회합니다.
 * @returns {Promise<DashboardSummaryResponse>}
 */
export const getDashboardSummary = () => {
  return unwrap(apiClient.get('/admin/dashboard/summary'));
};
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
