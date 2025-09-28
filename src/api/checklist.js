import apiClient from "./index";

// 카테고리별 체크리스트 조회
export const getChecklistsByCategory = (goodsCategoryId) => {
    return apiClient.get('/checklists', {
        params: {goodsCategoryId}
    });
}

// 카테고리별 가격 기준가 조회
export const getPriceBaselineByCategory = (goodsCategoryId) => {
    return apiClient.get('/pricing/baseline', {
        params: {goodsCategoryId}
    });
}