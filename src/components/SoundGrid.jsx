import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';
import eventBus from '../eventbus.js';
import { filter } from 'rxjs/operators';

window.eventBus = eventBus;

const toggle = (x) => x === 'on' ? 'off' : 'on';

const SoundGrid = ({ label, node, coords, updateCoords, forceUpdate }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    node.setActiveListener(setActive);
  }, [node]);

  useEffect(() => {
    eventBus.pipe(
      filter(e => e.id === node.id)
    ).subscribe(e => {
      console.log('from soundgrid', e);
      setActive(e.statusesIdx);
    });
  }, []);

  return (
    <HorizontalGrid
      label={label}
      status={node._aspects.statuses}
      update={i => {
        node.updateIn('statuses', i, toggle);
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
