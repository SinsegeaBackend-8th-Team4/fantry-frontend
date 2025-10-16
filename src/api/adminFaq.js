// src/api/adminFaq.js
import { apiClient } from './index';
<<<<<<< HEAD

/**
 * FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건과 페이징 정보
 * @param {object} params.condition - { status, csTypeId, memberName }
 * @param {object} params.pageable - { page, size, sort }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const searchFaqs = (params) => {
  return apiClient.get('/admin/cs/faq', { params });
=======
import { unwrap } from './InspectionHelper';

/**
 * FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다. (어드민용)
 * @param {object} params - { page, size, sort, categoryId, keyword }
 * @returns {Promise<Page<FaqAdminResponse>>}
 */
export const searchFaqs = (params) => {
  const queryParams = {
    page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
    size: params.size,
    sort: params.sort,
    csTypeId: params.csTypeId, // categoryId -> csTypeId
    status: params.status,
    keyword: params.keyword,
  };
  return unwrap(apiClient.get('/admin/cs/faq', { params: queryParams }));
};

/**
 * FAQ 카테고리 목록을 조회합니다.
 * @returns {Promise<List<FaqCategoryResponse>>}
 */
export const getFaqCategories = () => {
  return unwrap(apiClient.get('/admin/faq/categories'));
};

/**
 * FAQ 상태별 통계를 조회합니다.
 * @returns {Promise<FaqStatsResponse>}
 */
export const getFaqStats = () => {
  return unwrap(apiClient.get('/admin/cs/faq/stats'));
};

/**
 * 새로운 FAQ를 등록합니다.
 * @param {object} faqData - { csTypeId, title, content }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createFaq = (faqData) => {
  return apiClient.post('/admin/cs/faq', faqData);
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
};

/**
 * 특정 ID의 FAQ 상세 정보를 조회합니다.
 * @param {number} faqId - 조회할 FAQ의 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getFaqById = (faqId) => {
  return apiClient.get(`/admin/cs/faq/${faqId}`);
};

/**
<<<<<<< HEAD
 * 새로운 FAQ를 등록합니다.
 * @param {object} faqData - { csTypeId, title, content }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createFaq = (faqData) => {
  return apiClient.post('/admin/cs/faq', faqData);
=======
 * 특정 ID의 FAQ를 삭제합니다.
 * @param {number} faqId - 삭제할 FAQ의 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteFaq = (faqId) => {
  return apiClient.delete(`/admin/cs/faq/${faqId}`);
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
};

/**
 * 특정 ID의 FAQ를 수정합니다.
 * @param {number} faqId - 수정할 FAQ의 ID
 * @param {object} faqData - { csTypeId, title, content, status }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateFaq = (faqId, faqData) => {
  return apiClient.patch(`/admin/cs/faq/${faqId}`, faqData);
};

/**
<<<<<<< HEAD
 * 특정 ID의 FAQ를 삭제합니다.
 * @param {number} faqId - 삭제할 FAQ의 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteFaq = (faqId) => {
  return apiClient.delete(`/admin/cs/faq/${faqId}`);
};
=======
 * 특정 FAQ에 파일을 첨부합니다.
 * @param {number} faqId - 파일을 첨부할 FAQ의 ID
 * @param {File[]} files - 첨부할 파일 목록
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addFaqAttachments = (faqId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return apiClient.post(`/admin/cs/faq/${faqId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
>>>>>>> 9e2ff05ff607911e93867be14c9d9027c109dd10
