<script setup>
import RoomRenderer from './components/RoomRenderer.vue'
import { useRoomSketcherStore } from './stores/useRoomSketcherStore';
const roomSketcherStore = useRoomSketcherStore();

</script>

<template>
  <div v-if="roomSketcherStore.hasError" class="error-message">
    {{ roomSketcherStore.errorMessage }}
  </div>
  
  <div v-if="roomSketcherStore.loading" class="loading">
    Loading room...
  </div>
  <div v-else>
    <div class="control-panel">
      <h5>Selected Wall ID: {{ roomSketcherStore.selectedWall.id }}</h5>
      <button id="wall-next-button" @click="roomSketcherStore.selectNextWall()">Select Next Wall</button>

      <!-- <select id="wall-select"
        v-model="roomSketcherStore.selectedWallIndex" 
        @change="roomSketcherStore.setSelectedWall(roomSketcherStore.roomData.walls[roomSketcherStore.selectedWallIndex], roomSketcherStore.selectedWallIndex)">
        <option v-for="(wall, index) in roomSketcherStore.roomData.walls" :key="wall.id" :value="index">
          Wall {{ index + 1 }}
        </option>
      </select> -->
    </div>
    <RoomRenderer />
  </div>
</template>

<style scoped></style>