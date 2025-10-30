<template>
  <div class="room-renderer">
    <canvas ref="canvasRef" :width="props.canvasWidth" :height="props.canvasHeight"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'
import { useCanvasAPI } from '../composable/useCanvasAPI.js'

const roomSketcherStore = useRoomSketcherStore()
const { sketchRoom } = useCanvasAPI()

// Declare props
const props = defineProps({
  canvasHeight: Number,
  canvasWidth: Number
})

let ctx = null
const canvasRef = ref(null)

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) {
    roomSketcherStore.setError('Failed to get canvas context.')
    return
  }

  if (!roomSketcherStore.roomData) {
    roomSketcherStore.setError('No room data available for rendering.')
    return
  }

  // Initial sketch
  sketchRoom(ctx, roomSketcherStore.roomData, roomSketcherStore.selectedWall.id)
})

watch(() => roomSketcherStore.selectedWall, (newWall) => {
  if (ctx) {
    // Redraw room with new selected wall
    sketchRoom(ctx, roomSketcherStore.roomData, newWall.id)
  }
})

</script>

<style scoped>
canvas {
  background: rgb(242, 242, 242);
  display: block;
  margin: 0 auto;
}
</style>