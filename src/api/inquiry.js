// src/api/inquiry.js

import { apiClient } from './index';


/* -------------------------------------------------------------
  Inquiry(1:1문의) 기능 관련 API (사용자용)
---------------------------------------------------------------*/

/**
 * 현재 로그인한 사용자가 작성한 1:1 문의 목록을 페이징하여 조회합니다.
 * @param {object} params - 페이징 및 정렬 정보
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'inquiredAt,desc')
 * @returns {Promise<Page<InquirySummaryResponse>>}
 */
export const getMyInquiryList = ({ page, size, sort }) => {
    return apiClient.get('/cs/inquiry', {
        params: { page, size, sort }
    });
}

/**
 * 나의 특정 문의 상세 내용을 조회합니다.
 * @param {number} inquiryId - 조회할 문의의 ID
 * @returns {Promise<InquiryDetailUserResponse>}
 */
export const getMyInquiryDetail = (inquiryId) => {
    return apiClient.get(`/cs/inquiry/${inquiryId}`);
}

/**
 * 새로운 1:1 문의를 등록합니다.
 * @param {object} payload - 문의 생성에 필요한 데이터
 * @param {number} payload.csTypeId - 문의 유형 ID
 * @param {string} payload.title - 문의 제목
 * @param {string} payload.content - 문의 내용
 * @returns {Promise<InquirySummaryResponse>}
 */
export const createInquiry = (payload) => {
    return apiClient.post('/cs/inquiry', payload);
}

/**
 * 특정 1:1 문의에 파일을 첨부합니다.
 * @param {number} inquiryId - 파일을 첨부할 문의 ID
 * @param {FormData} formData - 파일 데이터가 담긴 FormData 객체
 * @returns {Promise<void>}
 */
export const addInquiryAttachments = (inquiryId, formData) => {
    return apiClient.post(`/cs/inquiry/${inquiryId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // 파일 업로드 시에는 Content-Type을 명시적으로 변경해줘야 합니다.
        },
    });
}