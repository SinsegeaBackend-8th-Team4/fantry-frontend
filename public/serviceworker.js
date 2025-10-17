self.addEventListener('activate', (event) => {
  clients.claim()
})

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification
  const url = clickedNotification.data?.url || '/' // notification.data에서 URL 가져오기

  // 알림 닫기
  clickedNotification.close()
  console.log('Notification clicked:', clickedNotification)
  console.log('Navigating to URL:', url)

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        // 원하는 URL 패턴을 가진 클라이언트 찾기
        if (client.url.startsWith('http://localhost:5173')) {
          client.focus()
          return client.navigate(url) // 해당 탭을 활성화
        }
      }
      // 일치하는 탭이 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})
