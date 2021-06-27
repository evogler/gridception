import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import { eventBus, on, onId, send } from '../eventbus.js';
import { filter } from 'rxjs/operators';

window.eventBus = eventBus;

const updated = (arr, idx, val) => {
  const res = [...arr];
  res[idx] = val;
  return res;
}

const SoundGrid = ({ id, label = 'temp' }) => {
  const [active, setActive] = useState(-1);

  const [status, setStatus] = useState(() => ['off', 'off']);

  // useEffect(() => {
  // node.setActiveListener(setActive);
  // }, [node]);

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
  const mute = () => { console.log('mute') };

  return (
    <HorizontalGrid
      label={id}
      status={status}
      update={index => {
        // node.updateIn('statuses', i, toggle);
        eventBus.next({ code: 'toggleStatusButton', id, index })
      }}
      // forceUpdate={forceUpdate}
      // node={node}
      active={active}
      startCoords={[100, 150 + 100 * id]}
      updateCoords={console.log}
      lengthen={lengthen}
      shorten={shorten}
      mute={mute}
    />
  );
};

export default SoundGrid;
