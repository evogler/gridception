import React, { useState, useEffect } from 'react';
import { send } from './eventbus.js';

const useDrag = ({ startX = 0, startY = 0, id, updateCoords = null }) => {
  const [dragging, setDragging] = useState(false);

  const setCoords = ([x, y]) => {
    send('drag', { id, x, y });
  };

  const handleMouseMove = (e) => {
    const xOffset = 25;
    const yOffset = 25;
    const x = e.clientX - xOffset;
    const y = e.clientY - yOffset;
    setCoords([x, y]);
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

  return startDrag;
}

export default useDrag;
