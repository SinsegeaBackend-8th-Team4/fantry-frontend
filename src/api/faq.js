// src/api/faq.js

import { apiClient } from './index';

/* -------------------------------------------------------------
  FAQ 기능 관련 API (사용자용)
---------------------------------------------------------------*/

/**
 * 공개된 FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 검색 조건 및 페이징 정보
 * @param {number} [params.csTypeId] - 카테고리 ID로 검색
 * @param {string} [params.keyword] - 제목 또는 내용에 포함된 키워드
 * @param {string} [params.status] - FAQ 상태 (예: ACTIVE, PINNED). 사용자용이므로 ACTIVE, PINNED만 유효.
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'createdAt,desc')
 * @returns {Promise<Page<FaqResponse>>}
 */
export const searchFaqs = (params) => {
    const queryParams = {
        page: params.page > 0 ? params.page - 1 : 0, // API는 0-based page
        size: params.size,
        sort: params.sort,
        csTypeId: params.csTypeId,
        keyword: params.keyword,
        status: params.status,
    };
    return apiClient.get('/cs/faq', {
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
    });
};
