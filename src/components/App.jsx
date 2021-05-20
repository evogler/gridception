import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import SoundGrid from './SoundGrid.jsx';
import HitsGrid from './HitsGrid.jsx';
import RatioBox from './RatioBox.jsx';
import Header from './Header.jsx';
import Line from './Line.jsx';
import { updateArray } from '../util.js';
import interpretPart from '../interpreter.js';
import Node from '../node.js';
import RatioNode from '../rationode.js';
import HitsNode from '../hitsnode.js';
import Scheduler from '../scheduler.js';

const scheduler = new Scheduler();

const jsonStr = `[{"id":0,"aspects":{"times":[1.334, 0.666],"sounds":["sidestick-2"],"volumes":[1],"rates":[1],"statuses":["on"]},"parent":5,"children":[1,2,3,4],"sounding":false,"coords":[100,200],"text":"2 : 2 1","type":"ratioNode"},{"id":1,"aspects":{"times":[1,1,1,1],"sounds":["ride"],"volumes":[1],"rates":[1],"statuses":["on","off","on","on"]},"parent":0,"children":[],"sounding":true,"coords":[430,113],"type":"node"},{"id":2,"aspects":{"times":[1,1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":0,"children":[],"sounding":true,"coords":[428,375],"type":"node"},{"id":3,"aspects":{"times":[1,1,1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["off","off","on","off"]},"parent":0,"children":[],"sounding":true,"coords":[428,203],"type":"node"},{"id":4,"aspects":{"times":[1,1,1,1,1],"sounds":["sidestick-2"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":0,"children":[],"sounding":true,"coords":[431,288],"type":"node"},{"id":5,"aspects":{"times":[1],"sounds":["sidestick-2"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[0],"sounding":false,"coords":[100,100],"text":"1 : 1","type":"ratioNode"}]`;

const jsonData = JSON.parse(jsonStr);

// console.log('json', jsonData);

const loadFromJson = (jsonData) => {
  const nodes = {};

  scheduler.reset();

  for (const json of jsonData) {
    if (json.type === 'node') {
      const n = new Node({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    } else if (json.type === 'ratioNode') {
      console.log('ratioNode');
      const n = new RatioNode({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    }
  }

  for (const node of Object.values(nodes)) {
    if (Number.isInteger(node._parent)) {
      node._parent = nodes[node._parent];
    }
    node._children = node._children.map(ch => nodes[ch]);
  }

  for (const node of Object.values(nodes)) {
    node._setAbsoluteTimes();
  }

  return nodes;
};

const nodes = loadFromJson(jsonData);

window.nodes = nodes;

const App = (props) => {
  const updateActive = (id, val) => {
    setActives(acts => ({ ...acts, [id]: val }));
  }

  const [actives, setActives] = useState(Object.fromEntries(Object.values(nodes).map(node => [node.id, 1])));
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


  const save = () => {
    const json = nodes.map(node => node.toJson());
    console.log(JSON.stringify(json));
  }

  return (
    <div id="app" >
      <Header
        buttonClick={buttonClick}
        currentTime={currentTime}
        save={save}
      />
      <div className="canvas">
        <RatioBox label="grid 1" node={nodes[5]} />
        <RatioBox label="grid 2" node={nodes[0]} />
        <SoundGrid label="ride" node={nodes[1]} />
        <SoundGrid label="hat" node={nodes[3]} />
        <SoundGrid label="stick" node={nodes[4]} />
        <SoundGrid label="kick" node={nodes[2]} />

      </div>
    </div>
  );
};

export default App;
