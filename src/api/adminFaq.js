// src/api/adminFaq.js
import { apiClient } from './index';

/**
 * FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건과 페이징 정보
 * @param {object} params.condition - { status, csTypeId, memberName }
 * @param {object} params.pageable - { page, size, sort }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const searchFaqs = (params) => {
  return apiClient.get('/admin/cs/faq', { params });
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
 * 새로운 FAQ를 등록합니다.
 * @param {object} faqData - { csTypeId, title, content }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createFaq = (faqData) => {
  return apiClient.post('/admin/cs/faq', faqData);
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
 * 특정 ID의 FAQ를 삭제합니다.
 * @param {number} faqId - 삭제할 FAQ의 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteFaq = (faqId) => {
  return apiClient.delete(`/admin/cs/faq/${faqId}`);
};
