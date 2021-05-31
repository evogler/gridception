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
import { jsonData, loadFromJson } from './fromJson.js';
import useGui from './useGui.js';
import useAudioEngine from './useAudioEngine.js';

const addSoundGrid = ({ audio, gui }, sound) => () => {
  const node = new Node();
  node.set('statuses', ['on', 'off', 'off', 'off', 'off', 'off']);
  node.set('sounds', [sound]);
  node.label = `new ${sound}`;
  node.setParent(nodes[5]);
  node._coords = [500, 500];
  gui.updateCoords(node.id)([500, 500]);
  audio.scheduler.addPart(node);
  audio.setNodes({ ...audio.nodes, [node.id]: node });
};

const Components = {
  'node': SoundGrid, 'ratioNode': RatioBox, 'hitsNode': HitsGrid,
};

const soundTypes = ['hat', 'ride', 'rim', 'kick'];

const App = (props) => {
  const audio = useAudioEngine();
  const gui = useGui(audio);

  return (
    <div id="app" >
      <Header
        buttonClick={gui.buttonClick}
        currentTime={gui.currentTime}
        save={audio.save}
        setBpm={audio.setBpm}
      />

      {soundTypes.map(sound => (
        <button onClick={addSoundGrid({ audio, gui }, sound)}>
          NEW {sound.toUpperCase()}
        </button>
      ))}

      <div className="canvas">
        {Object.values(audio.nodes).map(n => {
          const Component = Components[n.type];
          return (<Component
            key={n.id} node={n}
            label={n?.label || n._aspects.sounds[0]}
            updateCoords={gui.updateCoords(n.id)}
            forceUpdate={gui.forceUpdate}
          />);
        })}

        {Object.values(audio.nodes).map(node => node._parent && (
          <Line coords={[
            ...gui.parentCoords(node._parent.id),
            ...gui.childCoords(node.id)
          ]} />
        ))}
      </div>
    </div>
  );
};

export default App;
