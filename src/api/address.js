import { apiClient } from "./index.js";

const serverPath = import.meta.env.VITE_API_SERVER_URL;

// 배송지 전체 리스트 가져오기
export const getAllAddress = () => {
    return apiClient.get(serverPath + '/api/address/');
}

// 한명의 회원에 대한 모든 주소 가져오기
export const getAllAddressMember = (memberId) => {
    return apiClient.get(serverPath + `/api/address/member/${memberId}`);
}

// 하나의 배송지 가져오기
export const getAddress = (addressId) => {
    return apiClient.get(serverPath + `/api/address/${addressId}`);
}

// 배송지 추가하기
export const addAddress = (payload) => {
    return apiClient.post(serverPath + '/api/address/', payload);
}

// 배송지 수정하기
export const editAddress = (addressId, payload) => {
    return apiClient.put(serverPath + `/api/address/${addressId}`, payload);
}

// 배송지 삭제하기
export const deleteAddress = (addressId) => {
    return apiClient.delete(serverPath + `/api/address/${addressId}`);
}

//기본 배송지
export const setDefaultAddress = (mId, aId) => {
    return apiClient.patch(serverPath + `/api/address/default`, null, {
        params: {
            memberId: mId,
            addressId: aId
        }
    })
}