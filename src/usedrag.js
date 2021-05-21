import React, { useState, useEffect } from 'react';

const useDrag = (startX = 0, startY = 0, node = null, updateCoords = null) => {
  const [coords, setCoords] = useState([startX, startY]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    node._coords = coords;
  }, []);

  const handleMouseMove = (e) => {
    const xOffset = 25;
    const yOffset = 25;
    const x = e.clientX - xOffset;
    const y = e.clientY - yOffset;
    setCoords([x, y]);
    if (node) {
      node._coords = [x, y];
    }
    if (updateCoords) {
      updateCoords([x, y]);
    }
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
