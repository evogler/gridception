import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label, active }) => {
  const [x, y, startDrag] = useDrag();

  return (
    <div
      className="horizontal-grid"
      style={{ left: x, top: y }}
    >
      <DragIcon startDrag={startDrag} />
      <span className="horizontal-grid-label">{label}:</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === active && status[i] === 'on'} click={() => update(i)} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
