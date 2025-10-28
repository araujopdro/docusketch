import { defineStore } from 'pinia'

export const useRoomSketcherStore = defineStore('roomSketcher', {
  state: () => ({
    errorMessage: null,
    loading: true,
    roomData: null,
    roomCalculatedDimensions: { width: 0, height: 0, centerX: 0, centerY: 0 },
    selectedWallIndex: -1,
    selectedWall: { id: null },
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

    setSelectedWall(wall, index) {
      this.selectedWallIndex = index
      this.selectedWall = wall
    },

    selectNextWall() {
      if (!this.roomData || !this.roomData.walls || this.roomData.walls.length === 0) {
        this.setError('No walls available to select')
        return
      }
      
      this.selectedWallIndex = (this.selectedWallIndex + 1) % this.roomData.walls.length
      this.selectedWall = this.roomData.walls[this.selectedWallIndex]
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