import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
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
  }
})