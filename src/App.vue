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
  
  <RoomRenderer />
</template>

<style scoped></style>