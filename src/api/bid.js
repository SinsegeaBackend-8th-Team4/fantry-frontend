import { apiClient,publicApiClient } from './index'

export const getBidsByAuctionId = (auctionId) => {
    return publicApiClient.get(`/bids/auctions/${auctionId}`);
};

export const getBidsByMemberId = (memberId) => {
    return apiClient.get(`/bids/members/${memberId}`);
};