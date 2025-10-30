

/**
 * Calculate Room Dimensions and Wall Properties
 * @param {Object} canvasSize - The size of the canvas { width, height }
 * @param {Object} roomData - The room data containing corners and walls
 * @param {number} sketchScale - The scale factor for sketching
 * @param {number} offsetDist - The distance to offset parallel lines
 */
export function CalculateRoomDimensions(canvasSize, roomData, sketchScale, offsetDist = 50) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  // Center of canvas
  const canvasCenterX = canvasSize.width / 2
  const canvasCenterY = canvasSize.height / 2

  // Determine room bounds
  roomData.corners.forEach(corner => {
    if (corner.x < minX) minX = corner.x;
    if (corner.y < minY) minY = corner.y;
    if (corner.x > maxX) maxX = corner.x;
    if (corner.y > maxY) maxY = corner.y;
  });

  // Calculate room center
  const roomCenterX = (minX + maxX) / 2;
  const roomCenterY = (minY + maxY) / 2;

  // Calculate the sketch offset to center the room in the canvas
  roomData.sketchOffset = {
    x: canvasCenterX - (roomCenterX * sketchScale),
    y: canvasCenterY - (roomCenterY * sketchScale)
  };

  // Calculate and store each wall's properties
  // For each wall, find its start and end corners
  // Then calculate scaled coordinates, length, parallel and perpendicular lines
  roomData.walls.forEach(wall => {
    const startCorner = roomData.corners.find(c => c.wallStarts.some(w => w.id === wall.id))
    const endCorner = roomData.corners.find(c => c.wallEnds.some(w => w.id === wall.id))

    // Original coordinates
    wall.startCornerX = startCorner.x
    wall.startCornerY = startCorner.y
    wall.endCornerX = endCorner.x
    wall.endCornerY = endCorner.y

    // Store scaled coordinates
    wall.scaledStartCornerX = roomData.sketchOffset.x + (startCorner.x * sketchScale)
    wall.scaledStartCornerY = roomData.sketchOffset.y + (startCorner.y * sketchScale)
    wall.scaledEndCornerX = roomData.sketchOffset.x + (endCorner.x * sketchScale)
    wall.scaledEndCornerY = roomData.sketchOffset.y + (endCorner.y * sketchScale)

    // Calculate wall length
    const dx = wall.endCornerX - wall.startCornerX
    const dy = wall.endCornerY - wall.startCornerY
    wall.length = Math.sqrt(dx * dx + dy * dy)

    // Normalize direction vector
    const dirX = dx / wall.length
    const dirY = dy / wall.length

    // Perpendicular vector
    const perpX = -dirY
    const perpY = dirX

    // Calculate in original coords, then scale
    const parallelStartOrigX = wall.startCornerX + perpX * offsetDist
    const parallelStartOrigY = wall.startCornerY + perpY * offsetDist
    const parallelEndOrigX = wall.endCornerX + perpX * offsetDist
    const parallelEndOrigY = wall.endCornerY + perpY * offsetDist

    // Apply scale and offset
    wall.parallelStartX = roomData.sketchOffset.x + (parallelStartOrigX * sketchScale)
    wall.parallelStartY = roomData.sketchOffset.y + (parallelStartOrigY * sketchScale)
    wall.parallelEndX = roomData.sketchOffset.x + (parallelEndOrigX * sketchScale)
    wall.parallelEndY = roomData.sketchOffset.y + (parallelEndOrigY * sketchScale)

    // Reference point (start of the wall)
    const refX = wall.startCornerX
    const refY = wall.startCornerY

    let minPerpLength = Infinity
    let maxPerpLength = -Infinity

    roomData.corners.forEach(corner => {
      const vx = corner.x - refX
      const vy = corner.y - refY

      // Dot product gives projection length along perpendicular
      const perpProjection = vx * perpX + vy * perpY

      minPerpLength = Math.min(minPerpLength, perpProjection)
      maxPerpLength = Math.max(maxPerpLength, perpProjection)
    })

    // Calculate midpoint
    const midX = wall.startCornerX + dirX * (wall.length / 2)
    const midY = wall.startCornerY + dirY * (wall.length / 2)

    // Calculate perpendicular endpoints (in original coordinates)
    const perpStartOrigX = midX + perpX * minPerpLength
    const perpStartOrigY = midY + perpY * minPerpLength
    const perpEndOrigX = midX + perpX * maxPerpLength
    const perpEndOrigY = midY + perpY * maxPerpLength

    // Apply scale and offset to get canvas coordinates
    wall.perpStartX = roomData.sketchOffset.x + (perpStartOrigX * sketchScale)
    wall.perpStartY = roomData.sketchOffset.y + (perpStartOrigY * sketchScale)
    wall.perpEndX = roomData.sketchOffset.x + (perpEndOrigX * sketchScale)
    wall.perpEndY = roomData.sketchOffset.y + (perpEndOrigY * sketchScale)

    // Store perpendicular length (in original units)
    wall.perpendicularLength = maxPerpLength - minPerpLength
  })
}