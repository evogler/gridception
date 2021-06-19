import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import { eventBus } from '../eventbus.js';
import { filter } from 'rxjs/operators';

window.eventBus = eventBus;

const updated = (arr, idx, val) => {
  const res = [...arr];
  res[idx] = val;
  return res;
}

const SoundGrid = ({ label, node, coords, updateCoords, forceUpdate }) => {
  const [active, setActive] = useState(0);

  const [status, setStatus] = useState(() => node._aspects.statuses);

  useEffect(() => {
    node.setActiveListener(setActive);
  }, [node]);

  useEffect(() => {
    eventBus.pipe(filter(e => e.code === 'noteon' && e.event.id === node.id))
    .subscribe(({ event }) => setActive(event.statusesIdx));

    eventBus.pipe(filter(e => e.code === 'setStatus' && e.id === node.id))
    .subscribe((e) => setStatus(status => updated(status, e.index, e.status)));
  }, []);

  return (
    <HorizontalGrid
      label={label}
      status={status}
      update={index => {
        // node.updateIn('statuses', i, toggle);
        eventBus.next({ code: 'toggleStatusButton', id: node.id, index })
      }}
      forceUpdate={forceUpdate}
      node={node}
      active={active}
      startCoords={coords}
      updateCoords={updateCoords}
      lengthen={node.lengthen.bind(node)}
      shorten={node.shorten.bind(node)}
      mute={() => node.setSounding(!node.sounding)}
    />
  );
};

export default SoundGrid;
