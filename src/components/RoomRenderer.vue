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
import { ref, onMounted } from 'vue'

import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'

import { loadRoom } from '../composable/useGetRoomAPI.js'
import { useCanvasAPI } from '../composable/useCanvasAPI.js'

const { sketchRoom, sketchPerpendiculars } = useCanvasAPI()
const roomSketcherStore = useRoomSketcherStore()
const canvasRef = ref(null)

const sketchScale = 0.5
const canvasProps = {
  width: 800,
  height: 600
}

let ctx = null

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  loadRoom().then(data => {
    console.log('Room data loaded:', data)
    roomSketcherStore.setRoomData(data)

    const calculatedDimensions = CalculateRoomDimensions(data)
    roomSketcherStore.setRoomDimensions(calculatedDimensions)

    sketchRoom(ctx, roomSketcherStore.roomData, roomSketcherStore.roomCalculatedDimensions, sketchScale)
    sketchPerpendiculars(ctx, roomSketcherStore.roomData, roomSketcherStore.roomCalculatedDimensions, sketchScale)
  })
})

function CalculateRoomDimensions(roomData) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  roomData.corners.forEach(corner => {
    if (corner.x < minX) minX = corner.x;
    if (corner.y < minY) minY = corner.y;
    if (corner.x > maxX) maxX = corner.x;
    if (corner.y > maxY) maxY = corner.y;
  });

  const roomWidth = maxX - minX;
  const roomHeight = maxY - minY;
  const roomCenterX = (minX + maxX) / 2;
  const roomCenterY = (minY + maxY) / 2;

  console.log('Room Dimensions:', { width: roomWidth, height: roomHeight, centerX: roomCenterX, centerY: roomCenterY });
  return { width: roomWidth, height: roomHeight, centerX: roomCenterX, centerY: roomCenterY };
}

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