import { defineStore } from 'pinia'

export const useRoomSketcherStore = defineStore('roomSketcher', {
  state: () => ({
    errorMessage: null,
    loading: false,
    roomData: null,
    roomCalculatedDimensions: { width: 0, height: 0, centerX: 0, centerY: 0 },
  }),
  actions: {
    setError(errorMessage) {
      this.errorMessage = errorMessage
      this.loading = false
    },

    clearError() {
      this.errorMessage = null
    },

    setLoading(isLoading) {
      this.loading = isLoading
    },

    setRoomData(data) {
      this.roomData = data
      this.errorMessage = null
      this.loading = false
    },

    setRoomDimensions(dimensions) {
      this.roomCalculatedDimensions = dimensions
    },
  },

  getters: {
    hasError: (state) => state.errorMessage,
    isLoading: (state) => state.loading,
  }
})