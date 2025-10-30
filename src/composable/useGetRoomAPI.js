import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'

const loadingDelay = 750

/**
 * Loads room data from a specified URL or randomly selects one from the store.
 * @param {number|null} roomIndex - Optional index of the room file to load
 * @returns {Promise<Object>} - The loaded room data
 */
export async function loadRoom(roomIndex = null) {
  const roomSketcherStore = useRoomSketcherStore()
  try {
    roomSketcherStore.setLoading("Loading room data...")
    roomSketcherStore.clearError()

    //wait a few seconds for dramatic effect
    await new Promise(resolve => setTimeout(resolve, loadingDelay))
    
    let selectedRoomUrl 
    if (roomIndex !== null && roomIndex >= 0 && roomIndex < roomSketcherStore.roomFiles.length) {
      selectedRoomUrl = roomSketcherStore.roomFiles[roomIndex]
    } else {
      const roomFilesLength = roomSketcherStore.roomFiles.length
      // Select a random room file, not counting the last one, which is reserved for testing a broken file
      const randomIndex = Math.floor(Math.random() * (roomFilesLength - 1))
      selectedRoomUrl = roomSketcherStore.roomFiles[randomIndex]
    }

    const response = await fetch(selectedRoomUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

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

/**
 * Simple function to validate the structure of the room data.
 * @param {Object} room - The room data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function roomDataValidator(room) {
  return room && Array.isArray(room.walls) && Array.isArray(room.corners)
}