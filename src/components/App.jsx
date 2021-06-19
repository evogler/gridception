import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Line from './Line.jsx';
import LoadSong from './LoadSong.jsx';
import { SoundGrid, HitsGrid, RatioBox, componentTypes } from './componentTypes.js';
import { Node, RatioNode, HitsNode } from './nodeTypes.js';
import { funkyBeatStr, jazzRideStr, bossaStr, loadFromJson } from './fromJson.js';
import useGui from './gui.jsx';
import useAudioEngine from './useAudioEngine.js';
import { eventBus } from '../eventbus.js';

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

const soundTypes = ['hat', 'ride', 'rim', 'kick'];

const songs = [
  {
    title: 'Jazz ride',
    json: jazzRideStr,
  },
  {
    title: 'Prisencolinensinainciusol',
    json: funkyBeatStr,
  },
  {
   title: 'bossa',
   json: bossaStr,
  },
];

const App = (props) => {
  const [currentPage, setCurrentPage] = useState('LOAD');
  const audio = useAudioEngine();
  const gui = useGui(audio);

  const [bpm, updateBpm] = useState(400);

  // changing keyOffset is a way to force React to unmount old components
  const [keyOffset, setKeyOffset] = useState(0);

  const loadSong = (songJsonStr) => () => {
    const json = JSON.parse(songJsonStr);
    const nodes = loadFromJson(json.parts, audio.scheduler);
    const coords = Object.fromEntries(
      Object.entries(nodes).map(([k, v]) => [k, v._coords])
    );
    gui.setCoords(coords);
    audio.setNodes(nodes);
    audio.setBpm(json.bpm);
    updateBpm(json.bpm);
    gui.setActives(
      Object.fromEntries(Object.values(nodes).map(node => [node.id, 0]))
    );
    setKeyOffset(n => n + 10000);
    window.nodes = nodes;
    console.log('loadSong completed.');
  };

  const handleLoadButton = () => {
    setCurrentPage('LOAD');
  };

  const setLoadedSong = (song) => {
    setCurrentPage('MAIN');
    loadSong(song.json)();
  };

  const handleBpmChange = (bpm) => {
    updateBpm(bpm);
    audio.setBpm(bpm);
  }

  return (
    <div id="app" >
      <Header
        buttonClick={gui.buttonClick}
        currentTime={gui.currentTime}
        save={audio.save}
        bpm={bpm}
        setBpm={handleBpmChange}
        handleLoadButton={handleLoadButton}
      />

      {currentPage === 'MAIN' && (
        <>
          {soundTypes.map(sound => (
            <button onClick={addSoundGrid({ audio, gui }, sound)}>
              NEW {sound.toUpperCase()}
            </button>
          ))}

          <div className="canvas">
            {Object.values(audio.nodes).map(n => {
              const Component = componentTypes[n.type];
              return (<Component
                key={n.id + keyOffset} node={n}
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
        </>
      )}

      {currentPage === 'LOAD' && (
        <LoadSong
          songs={songs}
          setSong={setLoadedSong}
        />
      )}


    </div>
  );
};

export default App;
