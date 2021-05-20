import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label, node, active,
  startCoords, lengthen, shorten, mute }) => {

  const [x, y, drag] = useDrag(...startCoords, node);

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
      <DragIcon startDrag={drag} />
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
