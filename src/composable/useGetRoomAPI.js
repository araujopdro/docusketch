import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'

export async function loadRoom(roomIndex = null) {
  const roomSketcherStore = useRoomSketcherStore()
  try {
    roomSketcherStore.setLoading("Loading room data...")
    roomSketcherStore.clearError()

    //wait a few seconds for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let selectedRoomUrl 
    if (roomIndex !== null && roomIndex >= 0 && roomIndex < roomSketcherStore.roomFiles.length) {
      selectedRoomUrl = roomSketcherStore.roomFiles[roomIndex]
    } else {
      const roomFilesLength = roomSketcherStore.roomFiles.length
      const randomIndex = Math.floor(Math.random() * (roomFilesLength - 1))
      selectedRoomUrl = roomSketcherStore.roomFiles[randomIndex]
    }

    const response = await fetch(selectedRoomUrl)

    const roomData = await response.json()

    // Validate room data structure
    if (!roomDataValidator(roomData)) {
      throw new Error('Invalid room data format')
    }
    
    roomData.url = selectedRoomUrl
    return roomData
  } catch (error) {
    console.error('Error loading room:', error)
    roomSketcherStore.setError('Failed to load room data')
    throw error
  }
}

function roomDataValidator(room) {
  return room && Array.isArray(room.walls) && Array.isArray(room.corners)
}