import React, { useState } from 'react';

const GridCell = ({ index, status, active, click, paint, startPaint, painting }) => {
  const className = ['grid-cell', 'grid-cell-' + status, 'undraggable'];
  if (active && status === 'on') {
    className.push('grid-cell-active');
  }
  if (active && status === 'off') {
    className.push('grid-cell-active-off');
  }

  const handleMouseDown = () => {
    startPaint(index, status === 'on' ? 'off' : 'on');
  };

  const handleMouseOver = () => {
    paint(index);
  };

  const listenToPaint = () => { };
  const stopListenToPaint = () => { };

  return (
    <span
      onMouseDown={handleMouseDown}
      onMouseOver={painting ? handleMouseOver : undefined}
      className={className.join(' ')}

    />
  );
};

export default GridCell;