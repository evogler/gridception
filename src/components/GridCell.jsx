import React, { useState } from 'react';

const GridCell = ({ index, status, active, click }) => {
  const className = ['grid-cell', 'grid-cell-' + status];
  if (active && status === 'on') {
    className.push('grid-cell-active');
  }
  if (active && status === 'off') {
    className.push('grid-cell-active-off');
  }

  return (
    <span onClick={() => click(index)} className={className.join(' ')} />
  );
};

export default GridCell;