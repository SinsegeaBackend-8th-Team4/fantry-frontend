import { apiClient,publicApiClient } from './index'

/**
 * 특정 상품에 대한 모든 입찰 내역을 조회합니다.
 * @param {number} auctionId - 조회할 상품(경매)의 ID
 * @returns {Promise<List<Bid>>}
 */
export const getBidsByAuctionId = (auctionId) => {
    return publicApiClient.get(`/bids/auctions/${auctionId}`);
};

/**
 * 특정 회원의 모든 입찰 내역을 조회합니다.
 * @param {number} memberId - 조회할 회원의 ID
 * @returns {Promise<List<Bid>>}
 */
export const getBidsByMemberId = (memberId) => {
    return apiClient.get(`/bids/members/${memberId}`);
};

/**
 * 모든 입찰 내역을 조회합니다.
 * @returns {Promise<List<Bid>>}
 */
export const getAllBids = () => {
    return apiClient.get('/api/bids');
}

/**
 * 특정 회원이 특정 상품에 입찰한 내역을 조회합니다.
 * @param {object} params - 검색 조건
 * @param {number} params.memberId - 조회할 회원의 ID
 * @param {number} params.itemId - 조회할 상품의 ID
 * @returns {Promise<List<Bid>>}
 */
export const searchBids = ({ memberId, itemId }) => {
    return apiClient.get('/api/bids/search', {
        params: { memberId, itemId }
    });
}

