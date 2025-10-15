import { apiClient } from '.'

export const requestPaymentCreate = (payload) => {
  return apiClient.post('/payments', payload)
}

export const requestPaymentApprove = (orderId, payload) => {
  return apiClient.post('/payments/' + orderId + '/approve', payload)
}

export const requestPaymentCancel = (orderId, payload) => {
  return apiClient.post('/payments/' + orderId + '/cancel', payload)
}

export const requestPaymentVoid = (receiptId) => {
  return apiClient.post('/payments/' + receiptId + '/void')
}

export const requestPaymentApproveVerify = (orderId, payload) => {
  return requestPaymentVerify(orderId, payload)
}

export const requestPaymentReturnVerify = (orderId, payload) => {
  return requestPaymentVerify(orderId, payload)
}

export const requestPaymentCancelVerify = (orderId, payload) => {
  return requestPaymentVerify(orderId, payload)
}

const requestPaymentVerify = (orderId, payload) => {
  return apiClient.post('/payments/' + orderId + '/verify', payload)
}
