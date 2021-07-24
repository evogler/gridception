import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import { on, onId, send } from '../eventbus.js';

const updated = (arr, idx, val) => {
  const res = [...arr];
  res[idx] = val;
  return res;
}

const SoundGrid = ({ id, coords, label = 'temp' }) => {
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState(() => ['off', 'off']);

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    onId(id, 'noteon', (event) => setActive(event.statusesIdx));
    onId(id, 'setStatus', (e) => setStatus(status => updated(status, e.index, e.status)));
    window.aspectCount = 0;
    onId(id, 'setAspect', (e) => {
      if (e.aspect === 'statuses') { setStatus(e.values); }
    });
  }, []);

  const lengthen = () => { send('lengthen', { id }) };
  const shorten = () => { send('shorten', { id }) };
  const setLength = (length) => { send('setLength'), { id, length }};
  const toggleMute = () => {
    console.log('mute');
    if (muted) {
      send('unmute', { id });
    } else {
      send('mute', { id });
    }
    setMuted(muted => !muted);
  };

  return (
    <HorizontalGrid
      label={id}
      id={id}
      status={status}
      update={index => {
        // node.updateIn('statuses', i, toggle);
        send('toggleStatusButton', { id, index })
      }}
      // forceUpdate={forceUpdate}
      // node={node}
      active={active}
      coords={coords}
      updateCoords={console.log}
      lengthen={lengthen}
      shorten={shorten}
      setLength={setLength}
      muted={muted}
      toggleMute={toggleMute}
    />
  );
};

export default SoundGrid;
