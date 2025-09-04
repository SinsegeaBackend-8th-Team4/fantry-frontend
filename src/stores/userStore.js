import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogined: true,
    accessToken: null,
    refreshToken: null,
  }),
  getters: {
    getIsLogined: (state) => state.isLogined,
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
  },
  actions: {
    updateLogin(value) {
      this.isLogined = value
    },
    updateAccessToken(value) {
      this.accessToken = value
    },
    updateRefreshToken(value) {
      this.refreshToken = value
    },
    clearAccessToken() {
      this.accessToken = null
    },
    clearRefreshToken() {
      this.refreshToken = null
    },
    clearAll() {
      this.clearAccessToken()
      this.clearRefreshToken()
    },
  },
})
