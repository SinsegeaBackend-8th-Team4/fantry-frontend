import apiClient from './index';

// 굿즈 카테고리 전체 목록 조회
export const getGoodsCategories = () => {
    return apiClient.get('/catalog/goodsCategories');
}

// 아티스트 전체 목록 조회
export const getArtists = () => {
    return apiClient.get('/catalog/artists');
}

// 특정 아티스트 별 앨범 목록 조회
export const getAlbumsByArtist = (artistId) => {
    return apiClient.get('/catalog/albums', {
        params: {artistId}
    });
}