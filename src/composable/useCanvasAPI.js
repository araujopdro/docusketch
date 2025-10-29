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
            // Highlight selected wall
            sketchWall(ctx, startX, startY, endX, endY, 'red')

            // Draw parallel line outside the shape
            drawParallelLine(ctx, startX, startY, endX, endY, 50, 'red')

            // Draw perpendicular
            drawPerpendicularLine(ctx, startX, startY, endX, endY, length, 'blue')
          } else {
            // Regular wall
            sketchWall(ctx, startX, startY, endX, endY)

            // Add label to wall
            sketchLabel(ctx, startX, startY, endX, endY, `Length ${Math.round(length)}`, 'black', '8px');
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

    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  }

  function sketchLabel(ctx, startX, startY, endX, endY, text, color = 'black', fontSize = '12px') {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    const angle = Math.atan2(endY - startY, endX - startX)

    // Save the current context state
    ctx.save()
    ctx.translate(midX, midY)

    // Rotate to align with wall
    // Keep text readable (don't flip upside down)
    let rotation = angle
    if (Math.abs(angle) > Math.PI / 2) {
      rotation = angle + Math.PI  // Flip 180° if upside down
    }
    ctx.rotate(rotation)

    // Draw text
    ctx.font = `${fontSize} Arial`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(text, 0, -5)

    ctx.restore()
  }

  function drawParallelLine(ctx, startX, startY, endX, endY, distance, color) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    // Wall direction vector
    const dx = endX - startX
    const dy = endY - startY
    const wallLength = Math.sqrt(dx * dx + dy * dy)

    const dirX = dx / wallLength
    const dirY = dy / wallLength

    // Perpendicular
    const perpX = -dirY
    const perpY = dirX

    // Determine outward direction
    const outwardX = perpX
    const outwardY = perpY

    // Parallel line coordinates
    const parallelStartX = startX + outwardX * distance
    const parallelStartY = startY + outwardY * distance
    const parallelEndX = endX + outwardX * distance
    const parallelEndY = endY + outwardY * distance

    // Parallel line
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(parallelStartX, parallelStartY)
    ctx.lineTo(parallelEndX, parallelEndY)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // Connecting lines
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(parallelStartX, parallelStartY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(parallelEndX, parallelEndY)
    ctx.stroke()
    ctx.restore()

    sketchLabel(ctx, parallelStartX, parallelStartY, parallelEndX, parallelEndY,
      `Length: ${Math.round(wallLength)}`, color)

    sketchDot(ctx, parallelStartX, parallelStartY, color, 3)
    sketchDot(ctx, parallelEndX, parallelEndY, color, 3)
  }

  function drawPerpendicularLine(ctx, startX, startY, endX, endY, length, color) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }
    
    // placeholder
    length = 100  

    // Calculate midpoint
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    sketchDot(ctx, midX, midY, color, 3)

    // Wall direction vector
    const dx = endX - startX
    const dy = endY - startY
    const wallLength = Math.sqrt(dx * dx + dy * dy)

    // Normalize
    const dirX = dx / wallLength
    const dirY = dy / wallLength

    // Perpendicular
    const perpX = -dirY
    const perpY = dirX

    // Determine inside direction
    const inwardX = -perpX
    const inwardY = -perpY






    // Perpendicular line coordinates
    const perpEndX = midX + inwardX * length
    const perpEndY = midY + inwardY * length

    // Perpendicular line
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(midX, midY)
    ctx.lineTo(perpEndX, perpEndY)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // Label
    sketchLabel(ctx, midX, midY, perpEndX, perpEndY,
      `Perpendicular`, color)

    sketchDot(ctx, perpEndX, perpEndY, color, 3)
  }
  
  return {
    sketchRoom,
  }
}
