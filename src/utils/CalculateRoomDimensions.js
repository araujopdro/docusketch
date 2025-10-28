export function CalculateRoomDimensions(roomData) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  roomData.corners.forEach(corner => {
    if (corner.x < minX) minX = corner.x;
    if (corner.y < minY) minY = corner.y;
    if (corner.x > maxX) maxX = corner.x;
    if (corner.y > maxY) maxY = corner.y;
  });

  const roomWidth = maxX - minX;
  const roomHeight = maxY - minY;
  const roomCenterX = (minX + maxX) / 2;
  const roomCenterY = (minY + maxY) / 2;

  console.log('Room Dimensions:', { width: roomWidth, height: roomHeight, centerX: roomCenterX, centerY: roomCenterY });
  return { width: roomWidth, height: roomHeight, centerX: roomCenterX, centerY: roomCenterY };
}