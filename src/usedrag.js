import React, { useState } from 'react';

const useDrag = (startX = 0, startY = 0) => {
  const [coords, setCoords] = useState([startX, startY]);
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e) => {
    console.log(dragging);
    const xOffset = 25;
    const yOffset = 25;
    setCoords([e.clientX - xOffset, e.clientY - yOffset]);
  }

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener('mouseup', handleMouseUp, false);
    document.removeEventListener('mousemove', handleMouseMove, false);
  };

  const startDrag = () => {
    setDragging(true);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove, false);
  };

  return [ ...coords, startDrag];
}

export default useDrag;
