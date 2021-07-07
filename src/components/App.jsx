import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Line from './Line.jsx';
import LoadSong from './LoadSong.jsx';
import { SoundGrid, HitsGrid, RatioBox, componentTypes } from './componentTypes.js';
import { Node, RatioNode, HitsNode } from './nodeTypes.js';
import { funkyBeatStr, jazzRideStr, bossaStr, loadFromJson } from './fromJson.js';
import useGui from './gui.jsx';
import useAudioEngine from './useAudioEngine.js';
import { send, on, onId } from '../eventbus.js';
import graph from '../graph.js';

const addSoundGrid = (sound) => {
  send('newSoundGrid', { sound } );
};

const addRatioBox = () => {
  send('newRatioNode');
}

on('setAspect', (event) => { })

const soundTypes = ['hat', 'ride', 'rim', 'kick'];

const App = (props) => {
  const [currentPage, setCurrentPage] = useState('MAIN');
  const audio = useAudioEngine();
  const gui = useGui(audio);

  const [components, setComponents] = useState({});
  useEffect(() => {
    on('soundGridCreated', (event) => {
      console.log('soundgridcreated!!', event);
      gui.updateCoords(event.id)([200, 200]);
      console.log('got past gui.updatecoords');
      console.log('gui.coords', gui.coords);
      setComponents(components => ({ ...components, [event.id]: { type: 'soundGrid' } }));
    });

    on('ratioNodeCreated', (event) => {
      console.log('rationode create!d', event);
      gui.updateCoords(event.id)([200, 200]);
      setComponents(components => ({ ...components, [event.id]: { type: 'ratioBox' } }));
    });

  }, []);

  useEffect(() => {
    on('drag', e => {
      const { id, x, y } = e;
      gui.updateCoords(id)([x, y]);
    });
  }, [])

  const [bpm, updateBpm] = useState(400);

  // changing keyOffset is a way to force React to unmount old components
  const [keyOffset, setKeyOffset] = useState(0);

  const handleLoadButton = () => {
    setCurrentPage('LOAD');
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
            <button onClick={() => addSoundGrid(sound)}>
              NEW {sound.toUpperCase()}
            </button>
          ))}
          <button onClick={addRatioBox}>
            NEW RATIOBOX
            </button>
          <div className="canvas">
            {Object.entries(components).map(([id, component]) =>
              component.type === 'soundGrid'
                ? <SoundGrid
                  id={Number(id)}
                  coords={gui.coords[id]}
                />
                : component.type === 'ratioBox'
                ? <RatioBox
                  id={Number(id)}
                  coords={gui.coords[id]}
                />
                : <div>{component.type}</div>
            )}
          </div>
        </>
      )}

      {gui.getWires().map(coords => (
        <Line coords={coords} />
      ))}

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
