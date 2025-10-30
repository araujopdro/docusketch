import { defineStore } from 'pinia'

export const useRoomSketcherStore = defineStore('roomSketcher', {
  state: () => ({
    errorMessage: null,
    loadingMessage: null,
    roomFiles: ['/simple.json', '/t_shape.json', '/triangle.json', '/no_room_data.json'],
    roomData: null,
    selectedRoomIndex: null,
    roomCalculatedDimensions: { width: 0, height: 0, centerX: 0, centerY: 0 },
    selectedWallIndex: null,
    selectedWall: { id: null },
  }),
  actions: {
    setError(errorMessage) {
      this.errorMessage = errorMessage
      this.loadingMessage = null
    },

    clearError() {
      this.errorMessage = null
    },

    setLoading(loadingMessage) {
      this.loadingMessage = loadingMessage
    },

    setRoomData(data) {
      this.selectedRoomIndex = this.roomFiles.indexOf(data.url)
      this.roomData = data
      this.errorMessage = null
      this.loadingMessage = null
    },

    clearRoomData() {
      this.roomData = null
      this.selectedWall = { id: null }
      this.selectedWallIndex = null
      this.roomCalculatedDimensions = { width: 0, height: 0, centerX: 0, centerY: 0 }
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
      this.loadingMessage = null
    },
  },

  getters: {
    hasError: (state) => state.errorMessage,
    isLoading: (state) => state.loadingMessage !== null,
  }
})