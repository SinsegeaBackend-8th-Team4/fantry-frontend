// src/api/inquiry.js

import { apiClient } from './index';
import { unwrap } from './InspectionHelper';

/* -------------------------------------------------------------
  Inquiry(1:1문의) 기능 관련 API (사용자용)
---------------------------------------------------------------*/

/**
 * 현재 로그인한 사용자가 작성한 1:1 문의 목록을 페이징하여 조회합니다.
 * @param {object} params - 페이징 및 정렬 정보
 * @returns {Promise<Page<InquirySummaryResponse>>}
 */
export const getMyInquiryList = (params) => {
    const queryParams = {
        page: params.page > 0 ? params.page - 1 : 0,
        size: params.size,
        sort: params.sort,
    };
    return unwrap(apiClient.get('/cs/inquiry', { params: queryParams }));
}

/**
 * 나의 특정 문의 상세 내용을 조회합니다.
 * @param {number} inquiryId - 조회할 문의의 ID
 * @returns {Promise<InquiryDetailUserResponse>}
 */
export const getMyInquiryDetail = (inquiryId) => {
    return unwrap(apiClient.get(`/cs/inquiry/${inquiryId}`));
}

/**
 * 새로운 1:1 문의를 등록합니다.
 * @param {object} payload - 문의 생성에 필요한 데이터
 * @returns {Promise<InquirySummaryResponse>}
 */
export const createInquiry = (payload) => {
    return unwrap(apiClient.post('/cs/inquiry', payload));
}

/**
 * 특정 1:1 문의에 파일을 첨부합니다.
 * @param {number} inquiryId - 파일을 첨부할 문의 ID
 * @param {FormData} formData - 파일 데이터가 담긴 FormData 객체
 * @returns {Promise<void>}
 */
export const addInquiryAttachments = (inquiryId, formData) => {
    return unwrap(apiClient.post(`/cs/inquiry/${inquiryId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }));
}
