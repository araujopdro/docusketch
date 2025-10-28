import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import { useRoomSketcherStore } from './stores/useRoomSketcherStore.js'
import { loadRoom } from './composable/useGetRoomAPI.js'
import { CalculateRoomDimensions } from './utils/CalculateRoomDimensions.js'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

const roomSketcherStore = useRoomSketcherStore()

loadRoom().then(data => {
  console.log('Room data loaded:', data)
  roomSketcherStore.setRoomData(data)

  roomSketcherStore.setSelectedWall(data.walls[0], 0)

  const calculatedDimensions = CalculateRoomDimensions(roomSketcherStore.roomData)
  roomSketcherStore.setRoomDimensions(calculatedDimensions)
  console.log('Calculated Room Dimensions:', calculatedDimensions)
})

