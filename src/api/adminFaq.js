// src/api/adminFaq.js

import { apiClient } from './index';
import { unwrap } from './InspectionHelper';


/**
 * FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다. (관리자용)
 * @param {object} params - { page, size, sort, csTypeId, status, keyword }
 * @returns {Promise<Page<FaqResponse>>}
 */
export const searchFaqs = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
    size: params.size,
    sort: params.sort,
    csTypeId: params.csTypeId,
    status: params.status,
    keyword: params.keyword,
  };
  return unwrap(apiClient.get('/admin/cs/faq', { params: queryParams }));
};


// (명세에 없는 엔드포인트이므로 주석 처리 또는 삭제)
// export const getFaqCategories = () => {
//   return unwrap(apiClient.get('/admin/faq/categories'));
// };


/**
 * FAQ 상태별 통계를 조회합니다. (관리자용)
 * @returns {Promise<FaqStatsAdminResponse>}
 */
export const getFaqStats = () => {
  return unwrap(apiClient.get('/admin/cs/faq/stats'));
};


/**
 * 새로운 FAQ를 등록합니다.
 * @param {object} faqData - { csTypeId, title, content }
 * @returns {Promise<FaqResponse>}
 */
export const createFaq = (faqData) => {
  return unwrap(apiClient.post('/admin/cs/faq', faqData));
};


/**
 * 특정 FAQ의 상세 정보를 조회합니다.
 * @param {number} faqId - 조회할 FAQ의 ID
 * @returns {Promise<FaqResponse>}
 */
export const getFaqById = (faqId) => {
  return unwrap(apiClient.get(`/admin/cs/faq/${faqId}`));
};


/**
 * 특정 FAQ를 삭제합니다.
 * @param {number} faqId - 삭제할 FAQ의 ID
 * @returns {Promise<void>}
 */
export const deleteFaq = (faqId) => {
  return unwrap(apiClient.delete(`/admin/cs/faq/${faqId}`));
};


/**
 * 특정 FAQ를 수정합니다.
 * @param {number} faqId - 수정할 FAQ의 ID
 * @param {object} faqData - { csTypeId, title, content, status }
 * @returns {Promise<FaqResponse>}
 */
export const updateFaq = (faqId, faqData) => {
  return unwrap(apiClient.patch(`/admin/cs/faq/${faqId}`, faqData));
};


/**
 * 특정 FAQ에 파일을 첨부합니다.
 * @param {number} faqId - 파일을 첨부할 FAQ의 ID
 * @param {File[]} files - 첨부할 파일 목록
 * @returns {Promise<void>}
 */
export const addFaqAttachments = (faqId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return unwrap(apiClient.post(`/admin/cs/faq/${faqId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }));
};
