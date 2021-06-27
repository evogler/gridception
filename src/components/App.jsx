import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Line from './Line.jsx';
import LoadSong from './LoadSong.jsx';
import { SoundGrid, HitsGrid, RatioBox, componentTypes } from './componentTypes.js';
import { Node, RatioNode, HitsNode } from './nodeTypes.js';
import { funkyBeatStr, jazzRideStr, bossaStr, loadFromJson } from './fromJson.js';
import useGui from './gui.jsx';
import useAudioEngine from './useAudioEngine.js';
import { eventBus, on } from '../eventbus.js';
import graph from '../graph.js';

const addSoundGrid = (sound) => {
  eventBus.next({ code: 'newSoundGrid', sound });
};


on('setAspect', (event) => {

})

// const _addSoundGrid = ({ audio, gui }, sound) => () => {
//   node.label = `new ${sound}`;
//   node.setParent(nodes[5]);
//   node._coords = [500, 500];
//   gui.updateCoords(node.id)([500, 500]);
// };

const soundTypes = ['hat', 'ride', 'rim', 'kick'];

const App = (props) => {
  const [currentPage, setCurrentPage] = useState('MAIN');
  const audio = useAudioEngine();
  const gui = useGui(audio);

  const [components, setComponents] = useState({});
  on('soundGridCreated', (event) => {
    console.log(event);
    setComponents(components => ({ ...components, [event.id]: { type: 'soundGrid' }}));
  });
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
    graph.nodes = nodes;
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

  // const setLoadedSong = (song) => {
  //   setCurrentPage('MAIN');
  //   loadSong(song.json)();
  // };

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
            <button onClick={() => addSoundGrid(sound)}>
              NEW {sound.toUpperCase()}
            </button>
          ))}
          <div className="canvas">
            {Object.values(components).map(component => (
              <div>{component.type}</div>
            ))}
          </div>
          {/* <div className="canvas">
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
          </div> */}
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
