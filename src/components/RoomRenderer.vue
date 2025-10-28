<template>
  <div class="room-renderer">
    <canvas 
      ref="canvasRef" 
      :width="canvasProps.width" 
      :height="canvasProps.height"
      >
    </canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'

import { useCanvasAPI } from '../composable/useCanvasAPI.js'

const canvasRef = ref(null)

const sketchScale = 0.5
const canvasProps = {
  width: 800,
  height: 600
}

let ctx = null
const roomSketcherStore = useRoomSketcherStore()
const { sketchRoom } = useCanvasAPI()

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  sketchRoom(ctx, roomSketcherStore.roomData, roomSketcherStore.roomCalculatedDimensions, sketchScale, roomSketcherStore.selectedWall.id)
})

watch(() => roomSketcherStore.selectedWall, (newWall) => {
  if (ctx) {
    // Redraw room with new selected wall
    sketchRoom(ctx, roomSketcherStore.roomData, roomSketcherStore.roomCalculatedDimensions, sketchScale, newWall.id)
  }
}, { deep: true })

</script>

<style scoped>
.room-renderer {
  padding: 20px;
}

canvas {
  background: white;
  display: block;
  margin: 0 auto;
}
</style>