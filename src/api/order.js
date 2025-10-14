import { apiClient } from './index';

/**
 * 주문 관련 API
 */

/**
 * 즉시 구매 상품에 대한 새로운 주문을 생성합니다.
 * @param {object} orderData - 주문 생성에 필요한 데이터 (OrdersRequest)
 * @returns {Promise<object>} 생성된 주문 정보
 */
export const createInstantBuyOrder = (orderData) => {
  return apiClient.post('/orders/instant-buy', orderData);
};

/**
 * 주문 목록을 조건에 따라 페이징하여 조회합니다.
 * @param {object} params - 조회 조건
 * @param {object} params.pageable - 페이징 정보 (page, size, sort)
 * @param {number} [params.memberId] - 조회할 회원의 ID
 * @param {string} [params.orderStatus] - 조회할 주문의 상태
 * @returns {Promise<object>} 페이징 처리된 주문 목록 (PageOrdersResponse)
 */
export const getOrders = (params) => {
  return apiClient.get('/orders', { params });
};

/**
 * 특정 주문의 상세 정보를 조회합니다.
 * @param {number} ordersId - 조회할 주문의 ID
 * @returns {Promise<object>} 주문 상세 정보 (OrdersResponse)
 */
export const getOrderById = (ordersId) => {
  return apiClient.get(`/orders/${ordersId}`);
};

/**
 * 경매에서 낙찰된 주문에 대한 결제를 처리합니다.
 * @param {object} params - 요청 정보
 * @param {number} params.ordersId - 결제 처리할 주문의 ID
 * @param {string} params.shippingAddress - 배송 주소
 * @param {number} params.paymentId - 결제 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const completeAuctionPayment = ({ ordersId, shippingAddress, paymentId }) => {
  return apiClient.patch(`/orders/${ordersId}/payment`, null, { params: { shippingAddress, paymentId } });
};

/**
 * 주문 상태를 '배송 준비중'으로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const prepareShipment = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/prepare-shipment`);
};

/**
 * 주문 상태를 '배송중'으로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const shipOrder = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/ship`);
};

/**
 * 주문 상태를 '배송 완료'로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const markAsDelivered = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/delivered`);
};

/**
 * 주문 상태를 '구매 확정'으로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const confirmPurchase = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/confirmed`);
};

/**
 * 주문에 대한 '취소 요청'을 처리합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const requestCancel = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/cancel-requested`);
};

/**
 * 주문을 '취소 완료' 상태로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const cancelOrder = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/cancelled`);
};

/**
 * 주문에 대한 '환불 요청'을 처리합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const requestRefund = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/refund-requested`);
};

/**
 * 주문을 '환불 완료' 상태로 변경합니다.
 * @param {number} ordersId - 처리할 주문의 ID
 * @returns {Promise<string>} 작업 성공 메시지
 */
export const completeRefund = (ordersId) => {
  return apiClient.patch(`/orders/${ordersId}/status/refunded`);
};
