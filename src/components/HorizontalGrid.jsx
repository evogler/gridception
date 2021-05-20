import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label, setCoords, active, coords, lengthen, shorten, mute }) => {


  // const [coords, setCoords] = useState([startX, startY]);
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

  const [x, y] = coords;


  const [muted, setMuted] = useState(false);
  const toggleMute = () => {
    mute();
    setMuted(!muted);
  };

  return (
    <div
      className={['horizontal-grid', muted ? 'muted' : ''].join(' ')}
      style={{ left: x, top: y }}
    >
      <DragIcon startDrag={startDrag} />
      <span className="horizontal-grid-label">{label}:</span>
      <span onClick={lengthen}>+</span>
      <span onClick={shorten}>-</span>
      <span onClick={toggleMute}>m</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === active && status[i] === 'on'} click={() => update(i)} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
