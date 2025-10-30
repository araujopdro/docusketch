import { useRoomSketcherStore } from '../stores/useRoomSketcherStore'

export async function loadRoom(roomFileUrl = null) {
  const roomSketcherStore = useRoomSketcherStore()
  try {
    roomSketcherStore.setLoading(true)
    roomSketcherStore.clearError()

    //wait a few seconds for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    //const roomUrls = ['/simple.json', '/t_shape.json', '/triangle.json', '/no_room_data.json']
    const roomUrls = ['/simple.json', '/t_shape.json', '/triangle.json']
    const response = await fetch(roomUrls[Math.floor(Math.random() * roomUrls.length)])

    let roomData
    try {
      roomData = await response.json()
      if (!roomDataValidator(roomData)) {
        roomSketcherStore.setError('Invalid room data format')
        throw new Error('Invalid room data format')
      }

      return roomData
    } catch (parseError) {
      roomSketcherStore.setError('Failed to parse room data')
      throw new Error('Failed to parse room data')
    }
  } catch (error) {
    console.error('Error loading room:', error)
    roomSketcherStore.setError('Failed to load room data')
    throw error
  }
}

function roomDataValidator(room) {
  return room && Array.isArray(room.walls) && Array.isArray(room.corners)
}