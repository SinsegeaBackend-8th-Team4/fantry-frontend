import { apiClient } from './index'
import { unwrap, rethrow } from './InspectionHelper'
/* === 카테고리 API === */
// 굿즈 카테고리 전체 목록 조회
export const getGoodsCategories = () => unwrap(apiClient.get('/catalog/goodsCategories')).catch(rethrow)
// 신규 카테고리 등록
export const createGoodsCategory = (category) => unwrap(apiClient.post('/admin/catalog/goodsCategories', category)).catch(rethrow)
// 카테고리 수정
export const updateGoodsCategory = (categoryId, category) => unwrap(apiClient.put(`/admin/catalog/goodsCategories/${categoryId}`, category)).catch(rethrow)
// 카테고리 삭제
export const deleteGoodsCategory = (categoryId) => unwrap(apiClient.delete(`/admin/catalog/goodsCategories/${categoryId}`)).catch(rethrow)
/* =================== */

/* === 아티스트 API === */
// 아티스트 전체 목록 조회
export const getArtists = () => unwrap(apiClient.get('/catalog/artists')).catch(rethrow)
/* =================== */

/* === 앨범 API === */
// 특정 아티스트 별 앨범 목록 조회
export const getAlbumsByArtist = (artistId) => unwrap(apiClient.get('/catalog/albums', { params: { artistId } })).catch(rethrow)
/* =================== */
