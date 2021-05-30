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

const jsonStr = `[

  {"id":0,"label":"grid 1","aspects":{"times":[1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[1,3],"sounding":false,"coords":[100,160],"text":"1","type":"ratioNode"},

  {"id":1,"label":"ride","aspects":{"times":[1,1,1,1],"sounds":["ride"],"volumes":[1],"rates":[1],"statuses":["on","off","on","on"]},"parent":0,"children":[],"sounding":true,"coords":[430,113],"type":"node"},

  {"id":2,"label":"kick","aspects":{"times":[1,1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":5,"children":[],"sounding":true,"coords":[428,375],"type":"node"},

  {"id":3,"label":"hat","aspects":{"times":[1,1,1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["off","off","on","off"]},"parent":0,"children":[],"sounding":true,"coords":[428,203],"type":"node"},

  {"id":4,"label":"rim","aspects":{"times":[1,1,1,1,1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":5,"children":[],"sounding":true,"coords":[431,288],"type":"node"},

  {"id":5,"label":"grid 2","aspects":{"times":[1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[2,4],"sounding":false,"coords":[100,350],"text":"1","type":"ratioNode"}

]`;

const jsonData = JSON.parse(jsonStr);

const loadFromJson = (jsonData) => {
  const nodes = {};

  scheduler.reset();

  for (const json of jsonData) {
    if (json.type === 'node') {
      const n = new Node({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    } else if (json.type === 'ratioNode') {
      const n = new RatioNode({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    } else if (json.type === 'hitsNode') {
      const n = new HitsNode({ jsonData: json });
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



function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

const App = (props) => {

  const [nodes, setNodes] = useState(() => loadFromJson(jsonData));


  const [actives, setActives] = useState(Object.fromEntries(Object.values(nodes).map(node => [node.id, 1])));

  useEffect(() => {
    // console.log(actives);
    window.nodes = nodes;
  }, []);
  const [currentTime, setCurrentTime] = useState(0);

  const updateActive = id =>

    (id, val) => {
      setActives(acts => ({ ...acts, [id]: val }));
    }

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

  const [coords, setCoords] = useState(
    Object.fromEntries(Object.entries(nodes).map(([k, v]) => [k, v._coords]))
  );

  const updateCoords = id => val => {
    setCoords({ ...coords, [id]: val });
  };

  const parentCoords = id => {
    if ([0, 5].includes(id)) {
      return [coords[id][0] + 254, coords[id][1] + 50];
    }
    return [coords[id][0] + 12, coords[id][1] + 12];
  }

  const childCoords = id => {
    if ([0, 5].includes(id)) {
      return [coords[id][0] + 15, coords[id][1] + 12];
    }
    return [coords[id][0] + 12, coords[id][1] + 12];
  }

  const setBpm = bpm => { scheduler.setBpm(bpm); }

  const forceUpdate = useForceUpdate();

  const addNode = () => {
    const node = new Node();
    node.label = 'hat 2';
    node.setParent(nodes[5]);
    node._coords = [500, 500];
    node._setAbsoluteTimes();
    console.log('addNode, nodes', nodes, 'node', node);
    scheduler.addPart(node);
    setNodes({ ...nodes, [node.id]: node });
  };

  return (
    <div id="app" >
      <Header
        buttonClick={buttonClick}
        currentTime={currentTime}
        save={save}
        setBpm={setBpm}
      />
      <button onClick={addNode}>NEW NODE</button>

      <div className="canvas">
        {Object.values(nodes).map(n => {
          if (n.type === 'node') {
            return (<SoundGrid
              key={n.id}
              node={n}
              label={n?.label || n._aspects.sounds[0]}
              updateCoords={updateCoords(n.id)}
              forceUpdate={forceUpdate}
            />);
          } else if (n.type === 'ratioNode') {
            return (<RatioBox
              key={n.id}
              node={n}
              label={n?.label}
              updateCoords={updateCoords(n.id)}
            />);
          } else if (n.type === 'hitsNode') {
            return (<HitsGrid
              key={n.id}
              node={n}
              label={n?.label || n._aspects.sounds[0]}
              updateCoords={updateCoords(n.id)}
            />
            )
          }
        })}
        <Line coords={[...parentCoords(0), ...childCoords(1)]} />
        <Line coords={[...parentCoords(5), ...childCoords(2)]} />
        <Line coords={[...parentCoords(0), ...childCoords(3)]} />
        <Line coords={[...parentCoords(5), ...childCoords(4)]} />
      </div>
    </div>
  );
};

export default App;
