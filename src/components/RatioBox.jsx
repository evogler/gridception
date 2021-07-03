import React, { useState, useEffect } from 'react';
import { on, onId, send } from '../eventbus.js';
import DragIcon from './DragIcon.jsx';
import useDrag from '../usedrag.js';

const RatioBox = ({ label, id, coords = [0, 0], updateCoords }) => {
  const [text, setText] = useState('1 1 1 1');

  useEffect(() => {
    onId(id, 'setTime', (event) => {
      setText(event.text);
    })
  }, []);

  const handleSetTime = text => {
    send('setTime', { id, text });
  };

  const [x, y] = coords;
  const drag = useDrag({ id });

  return (
    <div className="ratio-box" style={{ left: x, top: y }} >
      <DragIcon startDrag={drag} />
      <span className="horizontal-grid-label">{label}</span>
      <textarea
        onChange={e => { handleSetTime(e.target.value); }}
      >
        {text}
      </textarea>
    </div>
  );
};

export default RatioBox;
