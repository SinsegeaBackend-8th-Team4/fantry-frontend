import { apiClient } from "./index.js";

// 배송지 전체 리스트 가져오기
export const getAllAddress = () => {
    return apiClient.get('/address/');
}

// 한명의 회원에 대한 모든 주소 가져오기
export const getAllAddressMember = (memberId) => {
    return apiClient.get(`/address/member/${memberId}`);
}

// 하나의 배송지 가져오기
export const getAddress = (addressId) => {
    return apiClient.get(`/address/${addressId}`);
}

// 배송지 추가하기
export const addAddress = (payload) => {
    return apiClient.post('/address/', payload);
}

// 배송지 수정하기
export const editAddress = (addressId, payload) => {
    return apiClient.put(`/address/${addressId}`, payload);
}

// 배송지 삭제하기
export const deleteAddress = (addressId) => {
    return apiClient.delete(`/address/${addressId}`);
}

//기본 배송지
export const setDefaultAddress = (mId, aId) => {
    return apiClient.patch(`/address/default`, null, {
        params: {
            memberId: mId,
            addressId: aId
        }
    })
}