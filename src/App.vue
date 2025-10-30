<template>
  <section class="control-panel">
    <div class="room-selection">
      <h3>Room: </h3>
      <select v-model="roomSketcherStore.selectedRoomIndex" :disabled="roomSketcherStore.loadingMessage"
        @change="handleRoomLoading(roomSketcherStore.selectedRoomIndex)">
        <option v-for="(roomFile, index) in roomSketcherStore.roomFiles" :key="index" :value="index">
          {{ roomFile }}
        </option>
      </select>
    </div>
    <div class="wall-selection">
      <button 
        id="wall-next-button" 
        @click="roomSketcherStore.selectNextWall()"
        :disabled="!roomSketcherStore.roomData || roomSketcherStore.loadingMessage"
        >Select Next Wall</button>
      <h5>Selected Wall: <strong>{{ roomSketcherStore.selectedWall.id }}</strong></h5>
    </div>
  </section>

  <section class="room-display">
    <div v-if="roomSketcherStore.hasError" class="error-message">
      {{ roomSketcherStore.errorMessage }}
    </div>

    <div v-if="roomSketcherStore.loadingMessage" class="loading-message">
      {{ roomSketcherStore.loadingMessage }}
    </div>
    <RoomRenderer v-else-if="!roomSketcherStore.loadingMessage && roomSketcherStore.roomData" />
  </section>

</template>

<script setup>
import { onMounted } from 'vue';
import RoomRenderer from './components/RoomRenderer.vue'

import { useRoomSketcherStore } from './stores/useRoomSketcherStore.js'
import { loadRoom } from './composable/useGetRoomAPI.js'
import { CalculateRoomDimensions } from './utils/CalculateRoomDimensions.js'

const roomSketcherStore = useRoomSketcherStore();

onMounted(() => {
  roomSketcherStore.clearError();
  handleRoomLoading();
});

function handleRoomLoading(roomIndex = null) {
  roomSketcherStore.clearRoomData();
  loadRoom(roomIndex).then(async (data) => {
    console.log('Room data loaded:', data)
    roomSketcherStore.setRoomData(data)

    roomSketcherStore.setLoading("Calculating room measurements...")
    await new Promise(resolve => setTimeout(resolve, 1000))

    const calculatedDimensions = CalculateRoomDimensions(roomSketcherStore.roomData)
    roomSketcherStore.setRoomDimensions(calculatedDimensions)
    console.log('Calculated Room Dimensions:', calculatedDimensions)

    roomSketcherStore.setSelectedWall(roomSketcherStore.roomData.walls[0], 0)
  })
}


</script>

<style scoped>
.control-panel {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: start;
}

.room-selection {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-selection h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.room-selection select {
  padding: 8px 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.87);
  background-color: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  cursor: pointer;
  min-width: 180px;
  transition: all 0.2s;
}

.room-selection select:hover:not(:disabled) {
  border-color: #007acc;
  background-color: #2a2a2a;
}

.room-selection select:focus {
  outline: none;
  border-color: #007acc;
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.3);
}

.room-selection select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.wall-selection {
  display: flex;
  align-items: center;
  gap: 15px;
}

.wall-selection button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.wall-selection button:disabled {
  background: #3a3a3a;
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  opacity: 0.5;
}

.wall-selection button:hover {
  background: #0096ff;
}

.wall-selection button:active {
  background: #005a9e;
}

.wall-selection h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
}

.wall-selection .wall-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #007acc;
}

.control-panel, .room-display {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  margin-bottom: 5px;
}

.room-display {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  background: #3a1515;
  color: #ff6b6b;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #5a2020;
  margin-bottom: 20px;
}

.loading-message {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  opacity: 0.7;
}
</style>