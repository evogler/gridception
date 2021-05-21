import React, { useState } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const RatioBox = ({ label, node, coords = [0, 0], updateCoords }) => {
  coords = node._coords ? node._coords : coords;
  const [x, y, drag] = useDrag(...coords, node, updateCoords);
  return (
    <div className="ratio-box" style={{ left: x, top: y }} >
      <DragIcon startDrag={drag} />
      <span className="horizontal-grid-label">{label}:</span>
      <textarea
        onChange={e => {
          node.setTime(e.target.value);
          console.log(e.target.value);
        }}
      >
        {node._text}
      </textarea>
    </div>
  );
};

export default RatioBox;
