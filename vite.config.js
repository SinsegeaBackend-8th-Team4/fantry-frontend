import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path' // 💡 alias를 위해 path 모듈 import (이미 있다면 유지)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(), // 💡 devtools도 plugins 배열에 추가해야 활성화됩니다.
  ],
  resolve: {
    alias: {
      // 💡 __dirname을 사용하려면 path 모듈이 필요합니다.
      '@': path.resolve(__dirname, './src'),
    },
  },
})