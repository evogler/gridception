import React from 'react';

const DragIcon = ({ startDrag }) => (
  <img
    className="drag-icon undraggable"
    src="icons/drag.svg"
    onMouseDown={startDrag}
  />
);

export default DragIcon;
