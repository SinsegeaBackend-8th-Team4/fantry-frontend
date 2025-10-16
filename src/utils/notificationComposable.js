import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  connectSse,
  disconnectSse,
  getAuctionsByUser,
  isConnected,
  MessageType,
  showNotification,
  subscribe,
} from '@/api/notification.js'
import { requestNotificationPermission } from '@/utils/permission.js'
import Toast from '@/components/common/atoms/Toast.vue'

/**
 * 알림 시스템을 관리하는 Vue Composable
 * SSE 연결, 메시지 처리, Service Worker 등록 등을 담당합니다.
 *
 * @param {Object} userStore - Pinia 사용자 스토어
 * @returns {Object} 알림 시스템 관련 함수들
 */
export function useNotification(userStore, useNotificationStore) {
  const router = useRouter()
  const toast = useToast()

  /**
   * 경매 상세 페이지로 이동합니다.
   * @param {string} auctionId - 경매 ID
   */
  const navigateToAuction = (auctionId) => {
    if (auctionId) {
      router.push(`/product/auction/${auctionId}`)
    }
  }

  /**
   * 메시지 타입에 따라 토스트를 표시합니다.
   * @param {string} type - 메시지 타입
   * @param {string} message - 메시지 내용
   * @param {string} auctionId - 경매 ID
   */
  const showToast = (type, message, auctionId) => {
    const toastConfig = {
      component: Toast,
      props: {
        title: '알림',
        message,
        onClick: () => navigateToAuction(auctionId),
      },
    }

    switch (type) {
      case MessageType.AUCTION_END:
        toast.info(toastConfig)
        break
      case MessageType.BID_SUCCESSFUL:
        toast.success(toastConfig)
        break
      case MessageType.BID_UPDATE:
        toast.warning(toastConfig)
        break
      default:
        if (import.meta.env.DEV) {
          console.log('[알림] 처리되지 않은 메시지 타입:', type, message)
        }
    }
  }

  /**
   * SSE 메시지를 처리합니다.
   * 페이지가 활성화되어 있으면 토스트로, 백그라운드면 브라우저 알림으로 표시합니다.
   * @param {Object} messageJson - 파싱된 메시지 객체
   */
  const handleMessage = (messageJson) => {
    // 연결 상태 메시지는 무시
    if (messageJson.type === MessageType.CONNECTION_STATUS) {
      return
    }

    if (document.visibilityState === 'visible' || document.hasFocus()) {
      // 페이지가 활성화되어 있으면 토스트 표시
      showToast(messageJson.type, messageJson.message, messageJson.auctionId)
    } else {
      // 백그라운드면 브라우저 알림 표시
      showNotification('Fantry 알림', {
        body: messageJson.message,
        data: {
          url: `/product/auction/${messageJson.auctionId}`,
        },
        actions: [
          {
            action: 'view-auction',
            title: '경매 확인',
          },
        ],
      })
      showToast(messageJson.type, messageJson.message, messageJson.auctionId)
    }
  }

  /**
   * SSE 연결을 초기화합니다.
   */
  const initNotification = () => {
    if (userStore.currentUser && !isConnected()) {
      connectSse(userStore.currentUser.id, {
        onOpen: () => {
          if (import.meta.env.DEV) {
            console.log('[SSE] 연결 성공')
          }
        },
        onRegistration: async () => {
          if (import.meta.env.DEV) {
            console.log('[SSE] Connection ID 할당 완료 - 구독 준비됨')
          }

          // 사용자의 입찰 경매 목록 조회 및 구독
          if (userStore.currentUser?.memberId) {
            try {
              useNotificationStore.auctions = await getAuctionsByUser(
                userStore.currentUser.memberId,
              )

              if (useNotificationStore.auctions && useNotificationStore.auctions.length > 0) {
                useNotificationStore.auctions.forEach((auctionId) => {
                  subscribe(userStore.currentUser.id, auctionId)
                })

                if (import.meta.env.DEV) {
                  console.log(`[SSE] ${useNotificationStore.auctions.length}개 경매 구독 완료`)
                }
              }
            } catch (error) {
              console.error('[SSE] 경매 구독 실패:', error)
            }
          }
        },
        onMessage: (message) => {
          try {
            const messageJson = JSON.parse(message)
            handleMessage(messageJson)
          } catch (error) {
            console.error('[SSE] 메시지 파싱 에러:', error, message)
          }
        },
        onError: (error) => {
          console.error('[SSE] 연결 에러:', error)
        },
      })
    }
  }

  /**
   * Service Worker를 등록합니다.
   */
  const registerServiceWorker = async () => {
    if (window.isSecureContext && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/serviceworker.js')
        await registration.update()

        if (import.meta.env.DEV) {
          console.log('[Service Worker] 등록 성공')
        }
      } catch (error) {
        console.error('[Service Worker] 등록 실패:', error)
      }
    }
  }

  /**
   * 알림 시스템을 초기화합니다.
   */
  const setupNotification = () => {
    registerServiceWorker()
    requestNotificationPermission()
  }

  // 사용자 로그인 상태를 감시하여 SSE 연결 관리
  watch(
    () => userStore.currentUser,
    (newUser) => {
      if (newUser && !isConnected()) {
        initNotification()
      } else if (!newUser) {
        disconnectSse()
      }
    },
    { immediate: true },
  )

  // 컴포넌트 마운트 시 알림 시스템 초기화
  onMounted(() => {
    setupNotification()
  })

  // 컴포넌트 언마운트 시 정리 (선택사항)
  // SSE 연결은 앱 전체에서 유지되므로 일반적으로 여기서 종료하지 않습니다.
  onUnmounted(() => {
    // 필요 시 disconnectSse 호출
  })

  return {
    initNotification,
    setupNotification,
  }
}
