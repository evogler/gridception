import React, { useState, useEffect } from 'react';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label, active }) => {
  const [coords, setCoords] = useState([500, 500]);
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

  return (
    <div
      className="horizontal-grid"
      style={{ left: coords[0], top: coords[1] }}
    >
      <img
        className="drag-icon undraggable"
        src="icons/drag.svg"
        onMouseDown={startDrag}
      />
      <span className="horizontal-grid-label">{label}:</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === active && status[i] === 'on'} click={() => update(i)} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
