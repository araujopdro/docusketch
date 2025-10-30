export function useCanvasAPI() {
  /**
   * Sketch the room on the given canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} room - The room data containing corners and walls
   */
  function sketchRoom(ctx, room, selectedWallId) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    if (!room) {
      console.error('No room data provided')
      return
    }

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Center of canvas
    const canvasCenterX = ctx.canvas.width / 2
    const canvasCenterY = ctx.canvas.height / 2
    sketchDot(ctx, canvasCenterX, canvasCenterY, 'green', 1)

    room.walls.forEach(wall => {
      if (wall.scaledStartCornerX === undefined || wall.scaledStartCornerY === undefined ||
        wall.scaledEndCornerX === undefined || wall.scaledEndCornerY === undefined) {
        console.warn(`Wall ${wall.id} is missing corner coordinates, skipping.`)
        return
      }

      if (selectedWallId && wall.id === selectedWallId) {
        // Highlight selected wall
        sketchLine(ctx, wall.scaledStartCornerX, wall.scaledStartCornerY, wall.scaledEndCornerX, wall.scaledEndCornerY, 'red')

        // Draw parallel line outside the shape
        sketchParallelLine(ctx, wall, 'red')

        // Draw perpendicular
        sketchPerpendicularLine(ctx, wall, 'blue')
      } else {
        // Regular wall
        sketchLine(ctx, wall.scaledStartCornerX, wall.scaledStartCornerY, wall.scaledEndCornerX, wall.scaledEndCornerY)

        // Add label to wall
        sketchLabel(ctx, wall.scaledStartCornerX, wall.scaledStartCornerY, wall.scaledEndCornerX, wall.scaledEndCornerY, `${wall.length?.toFixed(1)}`, 'black', '8px');
      }

      sketchDot(ctx, wall.scaledStartCornerX, wall.scaledStartCornerY, 'red')
      sketchDot(ctx, wall.scaledEndCornerX, wall.scaledEndCornerY, 'red')
    });
  }

  /**
   * Sketch a line/wall on the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} startX - The starting x-coordinate of the line
   * @param {number} startY - The starting y-coordinate of the line
   * @param {number} endX - The ending x-coordinate of the line
   * @param {number} endY - The ending y-coordinate of the line
   * @param {string} color - The color of the wall
   * @param {number} lineWidth - The width of the line
   * @param {Array} lineDash - The dash pattern for the line
   */
  function sketchLine(ctx, startX, startY, endX, endY, color = 'black', lineWidth = 1, lineDash = []) {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.setLineDash(lineDash)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }

  /**
   * Sketch a dot on the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} x - The x-coordinate of the dot
   * @param {number} y - The y-coordinate of the dot
   * @param {string} color - The color of the dot
   * @param {number} radius - The radius of the dot
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

  /**
   * Sketch a label along a line/wall
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} startX - The starting x-coordinate of the line
   * @param {number} startY - The starting y-coordinate of the line
   * @param {number} endX - The ending x-coordinate of the line
   * @param {number} endY - The ending y-coordinate of the line
   * @param {string} text - The label text to draw
   * @param {string} color - The color of the text
   * @param {string} fontSize - The font size of the text
   */
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

  /**
   * Sketch the parallel line for a wall
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} wall - The wall data containing start and end coordinates
   * @param {string} color - The color of the parallel line
   */
  function sketchParallelLine(ctx, wall, color = 'red') {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    if(!wall.parallelStartX || !wall.parallelStartY || !wall.parallelEndX || !wall.parallelEndY) {
      console.error('Wall is missing parallel line coordinates')
      return
    }
    
    // Parallel line
    sketchLine(ctx, wall.parallelStartX, wall.parallelStartY, wall.parallelEndX, wall.parallelEndY, color, 2, [5, 5])

    // Connecting lines
    sketchLine(ctx, wall.scaledStartCornerX, wall.scaledStartCornerY, wall.parallelStartX, wall.parallelStartY, color, 1)
    sketchLine(ctx, wall.scaledEndCornerX, wall.scaledEndCornerY, wall.parallelEndX, wall.parallelEndY, color, 1)

    // Add label to parallel line
    sketchLabel(ctx, wall.parallelStartX, wall.parallelStartY, wall.parallelEndX, wall.parallelEndY,
      `${wall.length?.toFixed(1)}`, color)

    // Draw endpoint dots
    sketchDot(ctx, wall.parallelStartX, wall.parallelStartY, color, 3)
    sketchDot(ctx, wall.parallelEndX, wall.parallelEndY, color, 3)
  }

  /**
   * Sketch the perpendicular line for a wall
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} wall - The wall data containing perpendicular line coordinates
   * @param {string} color - The color of the perpendicular line
   */
  function sketchPerpendicularLine(ctx, wall, color = 'blue') {
    if (!ctx) {
      console.error('Invalid canvas context')
      return
    }

    // Perpendicular line
    sketchLine(ctx, wall.perpStartX, wall.perpStartY, wall.perpEndX, wall.perpEndY, color, 2, [5, 5])

    // Draw endpoint dots
    sketchDot(ctx, wall.perpStartX, wall.perpStartY, color, 4)
    sketchDot(ctx, wall.perpEndX, wall.perpEndY, color, 4)

    // Add label
    sketchLabel(ctx, wall.perpStartX, wall.perpStartY, wall.perpEndX, wall.perpEndY,
      `${wall.perpendicularLength?.toFixed(1)}`, color, '12px');
  }

  return {
    sketchRoom,
  }
}
