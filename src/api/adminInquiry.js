// src/api/adminInquiry.js
import { apiClient } from './index';
import { unwrap } from './InspectionHelper';

/* ==================================================================================
 * 어드민 - 1:1 문의 관리 API
 * ================================================================================== */

/**
 * 1:1 문의 목록을 검색 조건에 따라 페이징하여 조회합니다. (어드민용)
 * @param {object} params - 플랫한 검색/페이징 파라미터 { page, size, sort, status, csTypeId, memberName }
 * @returns {Promise<Page<InquirySummaryAdminResponse>>} - unwrap된 페이징 객체
 */
export const searchInquiries = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
    size: params.size,
    sort: params.sort,
    status: params.status,
    csTypeId: params.csTypeId, // 이제 primitive ID
    memberName: params.memberName,
  };
  return unwrap(apiClient.get('/admin/cs/inquiry', {
    params: queryParams,
    paramsSerializer: (params) => {
      const qs = new URLSearchParams();
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          qs.append(key, params[key]);
        }
      }
      return qs.toString();
    },
  }));
};

/**
 * 특정 ID의 1:1 문의 상세 정보를 조회합니다. (어드민용)
 * @param {number} inquiryId - 조회할 문의의 ID
 * @returns {Promise<InquiryDetailAdminResponse>}
 */
export const getInquiryById = (inquiryId) => {
  return apiClient.get(`/admin/cs/inquiry/${inquiryId}`);
};

/**
 * 특정 1:1 문의에 답변을 등록하거나 수정하고 처리 상태를 변경합니다.
 * @param {number} inquiryId - 답변할 문의의 ID
 * @param {object} answerRequest - { answerContent: string, reqStatus: string, comment?: string }
 * @returns {Promise<InquiryDetailAdminResponse>}
 */
export const answerInquiry = (inquiryId, answerRequest) => {
  return apiClient.patch(`/admin/cs/inquiry/${inquiryId}/answer`, answerRequest);
};

/**
 * 1:1 문의 상태별 통계를 조회합니다. (어드민 대시보드용)
 * @returns {Promise<InquiryStatsAdminResponse>}
 */
export const getInquiryStats = () => {
  return unwrap(apiClient.get('/admin/cs/inquiry/stats'));
};


