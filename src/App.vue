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
  <div v-else-if="!roomSketcherStore.loading && roomSketcherStore.roomData">
    <div class="control-panel">
      <h5>Selected Wall ID: {{ roomSketcherStore.selectedWall.id }}</h5>
      <button id="wall-next-button" @click="roomSketcherStore.selectNextWall()">Select Next Wall</button>
    </div>
    <RoomRenderer />
  </div>
</template>

<style scoped></style>