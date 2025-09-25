import apiClient from "./index";

export const getAuctionDetails = (auctionId) => {
    return apiClient.get(`/auctions/${auctionId}`);
};