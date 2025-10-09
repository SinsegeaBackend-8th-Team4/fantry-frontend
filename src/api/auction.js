import { apiClient,publicApiClient } from './index'

export const getAuctionDetails = (auctionId) => {
    return publicApiClient.get(`/auctions/${auctionId}`);
};

export const getAllAuctions = () => {
    return publicApiClient.get('/auctions');
};

export const createAuction = (auctionData) => {
    return apiClient.post('/auctions', auctionData);
};

export const updateAuction = (auctionId, auctionData) => {
    return apiClient.put(`/auctions/${auctionId}`, auctionData);
}