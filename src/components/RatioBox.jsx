import React, { useState } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const RatioBox = ({ label, node, coords = [0, 0] }) => {
  const [x, y, drag] = useDrag(...coords, node);
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
        1 : 1
      </textarea>
    </div>
  );
};

export default RatioBox;
