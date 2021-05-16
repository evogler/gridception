import React, { useState, useEffect } from 'react';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, label }) => {

  return (
    <div>
      <span className="horizontal-grid-label">{label}:</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === 3} click={() => update(i)} />
      ))}
    </ div>
  );
};



export default HorizontalGrid;
