import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import { updateArray } from '../util.js';
import interpretPart from '../interpreter.js';
import Scheduler from '../scheduler.js';

const scheduler = new Scheduler();

const App = (props) => {
  const initialParts = [
    {
      label: 'stick',
      sound: ['sidestick-2'],
      duration: [1],
      status: ['off', 'off', 'off', 'off', 'on', 'off', 'off', 'off', 'off', 'off'],
    },
    {
      label: 'hat',
      sound: ['hat'],
      duration: [1],
      status: ['on', 'off', 'off', 'on', 'off', 'off', 'on', 'off', 'off',  ],
    },
    {
      label: 'kick',
      sound: ['kick'],
      duration: [1],
      status: ['on', 'off', 'off', 'off', 'off', 'off', 'off', 'off'],
    },
  ];
  const [parts, setParts] = useState(initialParts);

  useEffect(() => {
    initialParts.forEach(part => {
      const partFn = interpretPart(part);
      scheduler.addPart(partFn);
    });
  }, []);

  window.part = interpretPart(parts[0]);

  const toggle = (arr, index) => arr[index] = arr[index] === 'on' ? 'off' : 'on';

  const updatePart = partIndex => index => {
    console.log(partIndex, index);
    const newParts = [...parts];
    toggle(newParts[partIndex].status, index);
    setParts(newParts);
    console.log(newParts[partIndex].status);
  };

  const buttonClick = () => {
    scheduler.click();
  }

  return (
    <div id="app">
      <button className="button" onClick={buttonClick}>PLAY</button>
      {parts.map((part, idx) => (
        <HorizontalGrid key={idx} label={part.label} status={part.status} update={updatePart(idx)} />
      ))}
    </div>
  );
};

export default App;
