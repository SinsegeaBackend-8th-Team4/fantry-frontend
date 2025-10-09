import Bootpay from '@bootpay/client-js'
import { apiClient } from '@/api'

const REQUEST_URL = {
  create: '/payments',
  approve: (orderId) => {
    return `/payments/${orderId}/approve`
  },
  cancel: (orderId) => {
    return `/payments/${orderId}/cancel`
  },
  verify: (orderId) => {
    return `/payments/${orderId}/verify`
  },
}
const PAYMENT_APP_ID = import.meta.env.VITE_BOOTPAY_APPLICATION_ID
const INSTALLMENT = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const EXPOSUR_TYPE = Object.freeze({
  IFRAME: 'ifreme',
  POPUP: 'popup',
})
const RESPONSE_EVENT = Object.freeze({
  CONFIRM: 'confirm', //분리 승인으로 결제요청시 결제 승인이 되기 전 호출되는 이벤트입니다. data에 결제정보가 포함되어 전달됩니다.
  DONE: 'done', //성공적으로 결제 승인 되었을 호출되는 이벤트입니다. data에 결제정보가 포함되어 전달됩니다.
  CANCEL: 'cancel', //결제 진행 중 구매자가 취소 혹은 닫기 버튼을 눌러 나온 경우 호출되는 이벤트입니다.
  ERROR: 'error', //결제 진행 중 오류가 발생된 경우 호출되는 이벤트입니다.
  ISSUED: 'issued', //가상계좌 발급이 완료되면 호출되는 이벤트입니다.
  CLOSE: 'close', //(앱 SDK 전용) 결제창이 닫힐때 호출됩니다. 성공, 실패, 취소에 상관없이 모두 호출됩니다. bootpay-js를 통한 웹 개발시에는 이 이벤트는 호출되지 않습니다.
})
const PAYMENT_STATUS = Object.freeze({
  // 현금영수증 관련 실패
  CASH_RECEIPT_CANCEL_FAILED: -61, //현금영수증 발행취소가 실패한 상태값입니다.
  CASH_RECEIPT_ISSUE_FAILED: -60, //현금영수증 발행이 실패한 상태값입니다.

  // 자동결제(빌링키) 관련 실패
  BILLING_KEY_ISSUE_FAILED: -40, //자동결제 빌링키 발급 실패 상태값입니다.
  BILLING_KEY_CANCELLED: -11, //자동결제 빌링키 발급 취소 상태값입니다.

  // 결제 실패
  PAYMENT_APPROVAL_FAILED: -2, //결제 승인실패 오류가 발생된 상태값입니다.
  VIRTUAL_ACCOUNT_CANCELLED: -3, //가상계좌 발급 취소된 상태값입니다.
  PAYMENT_REQUEST_FAILED: -4, //결제 요청 실패가 발생된 상태값입니다.

  // 결제 진행 중 상태
  PAYMENT_PENDING: 0, //결제 대기 상태입니다. PG사 결제창이 생성되었을때의 상태입니다.
  PAYMENT_APPROVAL_IN_PROGRESS: 2, //결제승인중 상태입니다. 클라이언트 승인, 서버 승인 전 상태입니다.

  // 결제 완료 상태
  PAYMENT_COMPLETED: 1, //결제완료된 상태입니다. 부분취소가 된 상태에서 전체금액이 취소되지 않았다면, 결제완료 상태입니다.
  VIRTUAL_ACCOUNT_ISSUED: 5, //가상계좌 발급완료 및 입금 대기 상태입니다.
  PAYMENT_CANCELLED: 20, //결제취소 완료상태입니다. 결제된 금액 전액이 취소되면, 결제취소 완료상태가 됩니다.

  // 자동결제(빌링키) 상태
  BILLING_KEY_READY: 40, //자동결제 빌링키 발급 준비 상태입니다.
  BILLING_KEY_PRE_ISSUE: 41, //자동결제 빌링키 발급 이전 상태입니다. 생체인증, 비밀번호 결제시나리오에서 서버 승인 전 상태이기도 합니다.
  BILLING_KEY_ISSUED: 11, //자동결제 빌링키 발급 완료 상태값입니다.
  BILLING_KEY_SUCCESS: 42, //자동결제 빌링키 발급 성공 상태값입니다.

  // 본인인증 상태
  IDENTITY_VERIFICATION_READY: 50, //본인인증 시작 준비 상태값입니다.
  IDENTITY_VERIFICATION_COMPLETED: 12, //본인인증이 완료된 상태값입니다.

  // 현금영수증 상태
  CASH_RECEIPT_ISSUED: 60, //현금영수증을 별도 발행시 현금영수증 발행 완료된 상태값입니다.
  CASH_RECEIPT_CANCELLED: 61, //현금영수증 별도 발행시 현금영수증 발행 취소가 완료된 상태값입니다.
})
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const startPayment = async (member, item, price, onSuccess, onError) => {
  try {
    const responseCreated = await requestCreatePayment(member, item, price)
    if (!responseCreated.data.success) {
      throw {
        errorMessage: responseCreated.data.errorMessage || '결제 생성에 실패했습니다.',
      }
    }
    const resultReceipt = await requestPaymentToBootpay(
      member,
      responseCreated.data.data.orderId,
      item,
    )
    const responseSendReceipt = await sendReceipt(resultReceipt)
    if (!responseSendReceipt.data.success) {
      throw {
        errorMessage: responseSendReceipt.data.errorMessage || '영수증 전송에 실패했습니다.',
      }
    }
    await confirmPayment(resultReceipt.order_id, onSuccess)
  } catch (error) {
    // 이미 객체 형태면 그대로, 아니면 객체로 변환
    const errorObj =
      typeof error === 'object' && error !== null ? error : { errorMessage: String(error) }
    onError(errorObj)
  }
}

const requestCreatePayment = async (member, item, price) => {
  if (!member) {
    throw {
      errorMessage: '멤버 정보가 존재하지 않습니다.',
      description: '클라이언트에 멤버정보 없음.',
    }
  }
  return await apiClient.post(REQUEST_URL.create, {
    memberId: member.id,
    itemId: item.id,
    price: price,
  })
}

const requestPaymentToBootpay = async (member, orderId, item) => {
  const response = await Bootpay.requestPayment({
    application_id: PAYMENT_APP_ID,
    price: item.price * item.qty,
    order_name: item.name,
    order_id: orderId,
    tax_free: 0,
    user: createMemberData(member),
    items: [
      {
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      },
    ],
    extra: {
      open_type: EXPOSUR_TYPE.POPUP,
      card_quota: INSTALLMENT.join(','),
      escrow: false,
      separately_confirmed: false,
      display_error_result: true,
      timeout: 5,
    },
  })
  if (response.event === RESPONSE_EVENT.DONE) {
    return response.data
  } else if (response.event === RESPONSE_EVENT.ERROR) {
    throw response.data
  }
}

const sendReceipt = async (receiptData) => {
  return await apiClient.post(REQUEST_URL.approve(receiptData.order_id), {
    receiptData: JSON.stringify(receiptData),
  })
}

const confirmPayment = async (orderId, onSuccess) => {
  const maxRetries = 15
  const interval = 2000 // 2초

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiClient.get(REQUEST_URL.verify(orderId))
      const data = response.data
      if (data.success) {
        onSuccess(data)
        return
      }
      if (i < maxRetries - 1) {
        await sleep(interval)
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw {
          errorMessage: '결제 확인 중 오류가 발생했습니다.',
          originalError: error,
        }
      }
      await sleep(interval)
    }
  }

  throw {
    errorMessage: '결제 확인 지연 중입니다. 마이페이지에서 확인해주세요.',
  }
}

const createMemberData = (member) => {
  return {
    id: member.id,
    username: member.name,
    phone: member.phone,
    email: member.email,
  }
}

const Payment = {
  purchase: startPayment,
}

export { Payment, RESPONSE_EVENT, PAYMENT_STATUS, EXPOSUR_TYPE }
