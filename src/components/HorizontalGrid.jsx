import React, { useState, useEffect } from 'react';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label, active }) => {

  return (
    <div className="horizontal-grid">
      <span className="horizontal-grid-label">{label}:</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === active && status[i] === 'on'} click={() => update(i)} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
