import { apiClient } from './index'
import { unwrap, rethrow } from './InspectionHelper'

// 굿즈 카테고리 전체 목록 조회
export const getGoodsCategories = () =>
  unwrap(apiClient.get('/catalog/goodsCategories')).catch(rethrow)

// 아티스트 전체 목록 조회
export const getArtists = () => unwrap(apiClient.get('/catalog/artists')).catch(rethrow)

// 특정 아티스트 별 앨범 목록 조회
export const getAlbumsByArtist = (artistId) =>
  unwrap(apiClient.get('/catalog/albums', { params: { artistId } })).catch(rethrow)
