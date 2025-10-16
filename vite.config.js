import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap/scss', import.meta.url)),
        '~startbootstrap-sb-admin-2': fileURLToPath(new URL('./node_modules/startbootstrap-sb-admin-2/scss', import.meta.url))
      }
    },
    define: {
      global: 'window'
      // sockjs-client 발생 오류 해결
      //Vite에게 'global' 변수가 'window' 객체를 참조하도록 알려줌
    },
    css: {
      preprocessorOptions: {
        scss: {
          // node_modules에서 발생하는 Sass 경고를 무시하도록 설정
          quietDeps: true
        }
      }
    },
    server: {
      proxy: {
        // '/api'로 시작하는 모든 요청을 프록시 처리합니다.
        '/api': {
          // .env.development 파일에 정의된 백엔드 서버 주소를 타겟으로 설정합니다.
          target: env.VITE_API_SERVER_URL,
          // Cross-Origin 요청을 위해 Origin 헤더를 변경합니다.
          changeOrigin: true,
        },
      }
    }
  }
})