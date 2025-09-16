import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

//상태 관리 저장소 생성
const pinia = createPinia()

const app = createApp(App)
app.use(router)
//앱에서 저장소 사용
app.use(pinia)

app.mount('#app')
