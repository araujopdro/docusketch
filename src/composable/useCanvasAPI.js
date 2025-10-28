export function useCanvasAPI() {
  /**
   * Sketch the room on the given canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} room - The room data containing corners and walls
   * @param {Object} dimensions - The calculated dimensions of the room
   * @param {number} sketchScale - The scale factor for sketching
   */
  function sketchRoom(ctx, room, dimensions, sketchScale, selectedWallId) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    if (!room) {
      console.error('No room data provided')
      return
    }

    if (!dimensions) {
      console.error('No room dimensions provided')
      return
    }

    if (!sketchScale || sketchScale <= 0) {
      console.error('Invalid sketch scale, using default scale of 1')
      sketchScale = 1
    }

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Get corners
    const corners = room.corners

    // Center of canvas
    const canvasCenterX = ctx.canvas.width / 2
    const canvasCenterY = ctx.canvas.height / 2
    sketchDot(ctx, canvasCenterX, canvasCenterY, 'green')

    // Center of room
    const offsetX = canvasCenterX - (dimensions.centerX * sketchScale)
    const offsetY = canvasCenterY - (dimensions.centerY * sketchScale)
    console.log('offsetX', offsetX, 'offsetY', offsetY)

    for (const corner of corners) {
      const currentCorner = corner
      console.log('currentCorner', currentCorner)
      // Move to corner position
      const startX = offsetX + (currentCorner.x * sketchScale)
      const startY = offsetY + (currentCorner.y * sketchScale)

      ctx.moveTo(startX, startY)

      currentCorner.wallStarts.forEach(wall => {
        const endCorner = corners.find(c => c.wallEnds.some(w => w.id === wall.id))
        if (endCorner) {
          // End position
          const endX = offsetX + (endCorner.x * sketchScale)
          const endY = offsetY + (endCorner.y * sketchScale)
          const length = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
          )

          if (selectedWallId && wall.id === selectedWallId) {
            // Calculate wall length
            sketchWallLabel(ctx, startX, startY, endX, endY, `${Math.round(length)}`, 'red')
            // Highlight selected wall
            sketchWall(ctx, startX, startY, endX, endY, 'red')

            drawPerpendicularFromMidpoint(ctx, startX, startY, endX, endY, 50)


          } else {
            // Regular wall
            sketchWall(ctx, startX, startY, endX, endY)
            // Add label to wall
            sketchWallLabel(ctx, startX, startY, endX, endY, `${Math.round(length)}`)
          }

          console.log(`Wall ${wall.id}: (${Math.round(startX)}, ${Math.round(startY)}) → (${Math.round(endX)}, ${Math.round(endY)})`)
        }
      });

      sketchDot(ctx, startX, startY, 'red')
    }
  }

  /**
   * Sketch a line/wall on the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} startX - The starting x-coordinate
   * @param {number} startY - The starting y-coordinate
   * @param {number} endX - The ending x-coordinate
   * @param {number} endY - The ending y-coordinate
   */
  function sketchWall(ctx, startX, startY, endX, endY, color = 'black') {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = color
    ctx.stroke()
  }

  /**
   * Sketch a dot on the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} x - The x-coordinate of the dot
   * @param {number} y - The y-coordinate of the dot
   * @param {string} color - The color of the dot
   */
  function sketchDot(ctx, x, y, color, radius = 4) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  function sketchWallLabel(ctx, startX, startY, endX, endY, text, color = 'black') {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    // Calculate midpoint
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    // Calculate angle of the wall
    const angle = Math.atan2(endY - startY, endX - startX)

    // Save the current context state
    ctx.save()

    // Move to midpoint
    ctx.translate(midX, midY)

    // Rotate to align with wall
    // Keep text readable (don't flip upside down)
    let rotation = angle
    if (Math.abs(angle) > Math.PI / 2) {
      rotation = angle + Math.PI  // Flip 180° if upside down
    }
    ctx.rotate(rotation)

    // Draw text
    ctx.font = '12px Arial'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'  // Position above the line
    ctx.fillText(text, 0, -5)  // 5px above the line

    // Restore context
    ctx.restore()
  }

  /**
   * Sketch perpendicular lines from a room corner
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} room - The room data containing corners and walls
   * @param {Object} dimensions - The calculated dimensions of the room
   * @param {Object} corner - The corner from which to sketch perpendiculars
   * @param {number} sketchScale - The scale factor for sketching
   */
  function sketchPerpendiculars(ctx, room, dimensions, sketchScale) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    if (!room) {
      console.error('No room data provided')
      return
    }

    if (!dimensions) {
      console.error('No room dimensions provided')
      return
    }

    if (!sketchScale || sketchScale <= 0) {
      console.error('Invalid sketch scale, using default scale of 1')
      sketchScale = 1
    }

    // Get corners
    const corners = room.corners

    // Center of canvas
    const canvasCenterX = ctx.canvas.width / 2
    const canvasCenterY = ctx.canvas.height / 2

    // Center of room
    const offsetX = canvasCenterX - (dimensions.centerX * sketchScale)
    const offsetY = canvasCenterY - (dimensions.centerY * sketchScale)

    const xs = corners.map(c => c.x)
    const ys = corners.map(c => c.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const boundingBoxCorners = {
      topLeft: { x: minX, y: minY },
      topRight: { x: maxX, y: minY },
      bottomLeft: { x: minX, y: maxY },
      bottomRight: { x: maxX, y: maxY },
    }

    // Draw a dot for each bounding box corner
    for (const key in boundingBoxCorners) {
      const corner = boundingBoxCorners[key]
      const canvasX = (corner.x * sketchScale) + offsetX
      const canvasY = (corner.y * sketchScale) + offsetY
      sketchDot(ctx, canvasX, canvasY, 'blue', 2)
    }
  }

  return {
    sketchRoom,
  }
}
