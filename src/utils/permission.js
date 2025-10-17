/**
 * 브라우저의 알림 권한을 요청합니다.
 * 이미 권한이 부여된 경우 또는 브라우저가 알림을 지원하지 않는 경우 요청하지 않습니다.
 *
 * @returns {Promise<void>}
 */
export const requestNotificationPermission = async () => {
  if (import.meta.env.DEV) {
    console.log('[알림 권한] 요청 함수 호출됨')
  }

  if (!isNotificationSupported()) {
    if (import.meta.env.DEV) {
      console.warn('[알림 권한] 브라우저가 알림을 지원하지 않음')
    }
    return
  }

  if (Notification.permission === 'granted') {
    if (import.meta.env.DEV) {
      console.log('[알림 권한] 이미 권한이 설정되어 있음')
    }
    return
  }

  if (import.meta.env.DEV) {
    console.log('[알림 권한] 권한 요청 팝업 표시')
  }

  const result = await Notification.requestPermission()

  if (import.meta.env.DEV) {
    console.log('[알림 권한] 사용자 응답:', result)
  }
}

/**
 * 브라우저가 Web Notification API를 지원하는지 확인합니다.
 *
 * @returns {boolean} 지원 여부
 */
export const isNotificationSupported = () => {
  return 'Notification' in window
}

/**
 * 현재 알림 권한 상태를 확인합니다.
 *
 * @returns {'granted' | 'denied' | 'default' | null} 권한 상태
 */
export const getNotificationPermission = () => {
  return isNotificationSupported() ? Notification.permission : null
}
