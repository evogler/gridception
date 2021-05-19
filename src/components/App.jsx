import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import Header from './Header.jsx';
import Line from './Line.jsx';
import { updateArray } from '../util.js';
import interpretPart from '../interpreter.js';
import Node from '../node.js';
import Scheduler from '../scheduler.js';

const scheduler = new Scheduler();

const nodes = [new Node(), new Node()];
nodes[0].set('times', [1, 1, 2]);
nodes[0].setSounding(false);
nodes[1].set('times', [1, 1, 1, 1]);
nodes[1].set('statuses', ['on', 'on', 'on', 'on']);
nodes[1].setParent(nodes[0]);
scheduler.addPart(nodes[0]);
scheduler.addPart(nodes[1]);

const App = (props) => {
  const updateActive = (id, val) => {
    setActives(acts => ({ ...acts, [id]: val }));
  }

  const [actives, setActives] = useState(Object.fromEntries(nodes.map(node => [node.id, 1])));
  const [currentTime, setCurrentTime] = useState(0);

  const toggle = (x) => x === 'on' ? 'off' : 'on';

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
      <div className="canvas">
        <HorizontalGrid
          label="time"
          status={nodes[0]._aspects.statuses}
          update={i => {
            nodes[0].updateIn('statuses', i, toggle);
            console.log(nodes[0]._aspects.statuses);
          }}
          active={-1}
        />
        <HorizontalGrid
          label="time"
          status={nodes[1]._aspects.statuses}
          update={i => {
            nodes[1].updateIn('statuses', i, toggle);
            console.log(nodes[1]._aspects.statuses);
          }}
          active={-1}
        />

        {/* {parts.map((part, idx) => (
          <HorizontalGrid
            key={idx}
            label={part.label}
            status={part.status}
            update={updatePart(idx)}
            active={actives[part.id]}
          />
        ))} */}
      </div>
    </div>
  );
};

export default App;
