import apiClient from "./index";

// 카테고리별 체크리스트 조회
export const getChecklistsByCategory = (goodsCategoryId) => {
    return apiClient.get('/checklists', {
        params: {goodsCategoryId}
    });
}