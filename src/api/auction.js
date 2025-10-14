import { apiClient,publicApiClient } from './index'

/* -------------------------------------------------------------
  Auction(상품) 기능 관련 API
---------------------------------------------------------------*/

/**
 * 특정 상품의 상세 정보를 조회합니다.
 * @param {number} auctionId - 조회할 상품의 ID
 * @returns {Promise<AuctionDetailResponse>}
 */
export const getAuctionDetails = (auctionId) => {
    return publicApiClient.get(`/auctions/${auctionId}`);
};

/**
 * 상품 목록을 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 페이징 및 필터 정보
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'createdAt,desc')
 * @param {string} [params.saleType] - 판매 유형 (AUCTION, INSTANT_BUY)
 * @param {string} [params.saleStatus] - 판매 상태 (ACTIVE, SOLD 등)
 * @returns {Promise<Page<AuctionSummaryResponse>>}
 */
/**
 * 상품 목록을 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 페이징 및 필터 정보
 * @param {number} params.page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} params.size - 한 페이지에 보여줄 개수
 * @param {string} [params.sort] - 정렬 기준 (예: 'createdAt,desc')
 * @param {string} [params.saleType] - 판매 유형 (AUCTION, INSTANT_BUY)
 * @param {string} [params.saleStatus] - 판매 상태 (ACTIVE, SOLD 등)
 * @returns {Promise<Page<AuctionSummaryResponse>>}
 */
export const getAuctionList = ({ page, size, sort, saleType, saleStatus }) => {
    return apiClient.get('/api/auctions', {
        params: { page, size, sort, saleType, saleStatus }
    });
}

/**
 * 특정 회원이 등록한 모든 판매 상품 목록을 조회합니다.
 * @param {number} memberId - 조회할 회원의 ID
 * @returns {Promise<List<AuctionSummaryResponse>>}
 */
export const getAuctionsByMember = (memberId) => {
    return apiClient.get(`/api/auctions/member/${memberId}`);
}

/**
 * 특정 회원의 판매 상태별 상품 목록을 조회합니다.
 * @param {object} params - 조회 조건
 * @param {number} params.memberId - 조회할 회원의 ID
 * @param {string} params.saleStatus - 조회할 판매 상태
 * @returns {Promise<List<AuctionSummaryResponse>>}
 */
export const getAuctionsByMemberAndStatus = ({ memberId, saleStatus }) => {
    return apiClient.get(`/api/auctions/member/${memberId}/status`, {
        params: { saleStatus }
    });
}

/**
 * 새로운 판매 상품을 등록합니다.
 * @param {object} payload - 상품 등록에 필요한 데이터 (AuctionRequest)
 * @returns {Promise<string>} - 성공 메시지
 */
export const createAuction = (payload) => {
    return apiClient.post('/api/auctions', payload);
}

/**
 * 등록된 판매 상품을 삭제합니다.
 * @param {number} auctionId - 삭제할 상품의 ID
 * @returns {Promise<string>} - 성공 메시지
 */
export const deleteAuction = (auctionId) => {
    return apiClient.delete(`/api/auctions/${auctionId}`);
}

/**
 * 상품을 판매 완료 상태로 변경합니다.
 * @param {object} params - 요청 정보
 * @param {number} params.auctionId - 처리할 상품의 ID
 * @param {number} params.finalPrice - 최종 판매 가격
 * @returns {Promise<string>} - 성공 메시지
 */
export const markAuctionAsSold = ({ auctionId, finalPrice }) => {
    return apiClient.patch(`/api/auctions/${auctionId}/status/sold`, null, {
        params: { finalPrice }
    });
}

/**
 * 상품을 판매 실패(유찰) 상태로 변경합니다.
 * @param {number} auctionId - 처리할 상품의 ID
 * @returns {Promise<string>} - 성공 메시지
 */
export const markAuctionAsNotSold = (auctionId) => {
    return apiClient.patch(`/api/auctions/${auctionId}/status/not-sold`);
}

/**
 * 상품을 판매 취소 상태로 변경합니다.
 * @param {number} auctionId - 처리할 상품의 ID
 * @returns {Promise<string>} - 성공 메시지
 */
export const cancelAuction = (auctionId) => {
    return apiClient.patch(`/api/auctions/${auctionId}/status/cancelled`);
}

/**
 * 상품을 다시 판매 중(활성) 상태로 변경합니다.
 * @param {number} auctionId - 처리할 상품의 ID
 * @returns {Promise<string>} - 성공 메시지
 */
export const activateAuction = (auctionId) => {
    return apiClient.patch(`/api/auctions/${auctionId}/status/active`);
}

/**
 * 상품의 판매 유형을 변경합니다.
 * @param {object} params - 요청 정보
 * @param {number} params.auctionId - 처리할 상품의 ID
 * @param {string} params.newSaleType - 새로운 판매 유형 (AUCTION, INSTANT_BUY)
 * @returns {Promise<string>} - 성공 메시지
 */
export const changeAuctionSaleType = ({ auctionId, newSaleType }) => {
    return apiClient.patch(`/api/auctions/${auctionId}/sale-type`, null, {
        params: { newSaleType }
    });
}