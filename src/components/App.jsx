import React, { useState, useEffect } from 'react';
import { updateArray } from '../util.js';
import HorizontalGrid from './HorizontalGrid.jsx';
import interpretPart from '../interpreter.js';

const App = (props) => {
  const [parts, setParts] = useState([
    {
      label: 'snare',
      sound: ['snare'],
      duration: [1],
      status: ['on', 'off', 'on', 'off', 'on', 'off', 'off'],
    },
    {
      label: 'kick',
      sound: ['kick'],
      duration: [1],
      status: ['on', 'off', 'off', 'off'],
    },
  ]);

  window.part = interpretPart(parts[0]);

  const toggle = (arr, index) => arr[index] = arr[index] === 'on' ? 'off' : 'on';

  const updatePart = partIndex => index => {
    console.log(partIndex, index);
    const newParts = [...parts];
    toggle(newParts[partIndex].status, index);
    setParts(newParts);
    console.log(newParts[partIndex].status);
  };

  return (
    <div id="app">
      {parts.map((part, idx) => (
        <HorizontalGrid key={idx} label={part.label} status={part.status} update={updatePart(idx)} />
      ))}
    </div>
  );
};

export default App;
