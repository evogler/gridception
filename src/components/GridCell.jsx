import React, { useState } from 'react';

const GridCell = ({ index, status, active, click }) => {
  const className = ['grid-cell', 'grid-cell-' + status];
  if (active) {
    className.push('grid-cell-active');
  }

  return (
    <span onClick={() => click(index)} className={className.join(' ')} />
  );
};

export default GridCell;