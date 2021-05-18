import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import Header from './Header.jsx';
import Line from './Line.jsx';
import { updateArray } from '../util.js';
import interpretPart from '../interpreter.js';
import Node from '../node.js';
import Scheduler from '../scheduler.js';

const scheduler = new Scheduler();

const xx = (val, count) => [...new Array(count)].fill(val).flat(9);

const App = (props) => {
  const updateActive = (id, val) => {
    setActives(acts => ({ ...acts, [id]: val }));
  }

  const initialParts = [
    {
      label: 'stick',
      sound: ['sidestick-2'],
      duration: [1],
      status: xx(['off', 'off', 'off', 'off', 'off', 'off', 'on', 'off', 'off', 'off', 'off', 'off'], 1),
      id: 0,
      indexFn: (idx) => updateActive(0, idx),
    },
    {
      label: 'hat',
      duration: [1],
      status: xx(['on', 'off', 'off'], 3).slice(0, 7),
      id: 1,
      indexFn: (idx) => updateActive(1, idx),
    },
    {
      label: 'kick',
      sound: ['kick'],
      duration: [1],
      status: xx(['on', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off'], 1),
      id: 2,
      indexFn: (idx) => updateActive(2, idx),
    },
  ];

  const [parts, setParts] = useState(initialParts);
  const [actives, setActives] = useState(Object.fromEntries(parts.map(part => [part.id, 0])));
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    initialParts.forEach(part => {
      const partFn = interpretPart(part);
      scheduler.addPart(partFn);
    });
  }, []);

  // window.part = interpretPart(parts[0]);

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

  scheduler.addTimeListener((time) => setCurrentTime(time));

  return (
    <div id="app">
      <Header
        buttonClick={buttonClick}
        currentTime={currentTime}
      />
      <div className="grids draggable"
        onMouseDown={(e) => console.log('MOUSEDOWN', e.target.className)}
      >
        {parts.map((part, idx) => (
          <HorizontalGrid
            key={idx}
            label={part.label}
            status={part.status}
            update={updatePart(idx)}
            active={actives[part.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
