import React, { useState } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const SoundGrid = ({ label, node, coords, setCoords }) => {
  return (
    <HorizontalGrid
      label={label}
      status={node._aspects.statuses}
      update={i => {
        node.updateIn('statuses', i, toggle);
        console.log(node._aspects.statuses);
      }}
      setCoords={setCoords}
      active={-1}
      coords={coords}
      setCoords={setCoords}
      lengthen={node.lengthen.bind(node)}
      shorten={node.shorten.bind(node)}
      mute={() => node.setSounding(!node.sounding)}
    />
  );
};

export default SoundGrid;
