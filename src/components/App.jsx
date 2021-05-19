import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import SoundGrid from './SoundGrid.jsx';
import HitsGrid from './HitsGrid.jsx';
import Header from './Header.jsx';
import Line from './Line.jsx';
import { updateArray } from '../util.js';
import interpretPart from '../interpreter.js';
import Node from '../node.js';
import RatioNode from '../rationode.js';
import HitsNode from '../hitsnode.js';
import Scheduler from '../scheduler.js';

const scheduler = new Scheduler();

const nodes = [new HitsNode({ length: 8, jsonData: {} }), new Node()];
nodes[0].setSounding(false);
window.n = nodes[0];

nodes[1].set('times', [1, 1, 1, 1, 1]);
nodes[1].set('statuses', ['on', 'on', 'on', 'on', 'on']);
nodes[1].setParent(nodes[0]);
scheduler.addPart(nodes[0]);
scheduler.addPart(nodes[1]);

const App = (props) => {
  const updateActive = (id, val) => {
    setActives(acts => ({ ...acts, [id]: val }));
  }

  const [actives, setActives] = useState(Object.fromEntries(nodes.map(node => [node.id, 1])));
  const [currentTime, setCurrentTime] = useState(0);

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
        <HitsGrid
          label="time"
          node={nodes[0]}
        />
        <SoundGrid
          label="stick"
          node={nodes[1]}
        />

      </div>
    </div>
  );
};

export default App;
