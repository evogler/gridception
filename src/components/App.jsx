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

const nodes = [];
nodes.push(new RatioNode({ timeStr: '1 : 1' }));
nodes[0].setSounding(false);

nodes.push(new Node());
nodes[1].set('times', [1, 1, 1, 1]);
nodes[1].set('statuses', ['off', 'off', 'off', 'off']);
nodes[1].set('sounds', ['ride']);
nodes[1].setParent(nodes[0]);

nodes.push(new Node());
nodes[2].set('times', [1, 1, 1, 1, 1]);
nodes[2].set('statuses', ['off', 'off', 'off', 'off', 'off']);
nodes[2].set('sounds', ['kick']);
nodes[2].setParent(nodes[0]);

nodes.push(new Node());
nodes[3].set('times', [1, 1, 1, 1]);
nodes[3].set('statuses', ['off', 'off', 'off', 'off']);
nodes[3].set('sounds', ['hat']);
nodes[3].setParent(nodes[0]);

nodes.push(new Node());
nodes[4].set('times', [1, 1, 1, 1, 1]);
nodes[4].set('statuses', ['off', 'off', 'off', 'off', 'off']);
nodes[4].set('sounds', ['sidestick-2']);
nodes[4].setParent(nodes[0]);

nodes.push(new RatioNode({ timeStr: '1 : 1'}));
nodes[5].setSounding(false);
nodes[0].setParent(nodes[5]);

scheduler.addPart(nodes[0]);
scheduler.addPart(nodes[1]);
scheduler.addPart(nodes[2]);
scheduler.addPart(nodes[3]);
scheduler.addPart(nodes[4]);
scheduler.addPart(nodes[5]);

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


  const save = () => {
    // console.log(nodes[1].toJson());
    console.log(nodes[1]._coords);
  }

  return (
    <div id="app" >
      <Header
        buttonClick={buttonClick}
        currentTime={currentTime}
        save={save}
      />
      <div className="canvas">
        <RatioBox label="grid 1" node={nodes[5]} coords={[100, 100]} />
        <RatioBox label="grid 2" node={nodes[0]} coords={[100, 200]}/>
        <SoundGrid label="ride" node={nodes[1]} coords={[400, 300]} />
        {/* <SoundGrid label="hat" node={nodes[3]}  coords={[400, 400]}/> */}
        {/* <SoundGrid label="stick" node={nodes[4]} coords={[400, 500]}/> */}
        {/* <SoundGrid label="kick" node={nodes[2]} coords={[400, 600]}/> */}

      </div>
    </div>
  );
};

export default App;
