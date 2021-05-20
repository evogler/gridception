import React, { useState } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const SoundGrid = ({ label, node, coords }) => {
  return (
    <HorizontalGrid
      label={label}
      status={node._aspects.statuses}
      update={i => {
        node.updateIn('statuses', i, toggle);
      }}
      node={node}
      active={1}
      startCoords={coords}
      lengthen={node.lengthen.bind(node)}
      shorten={node.shorten.bind(node)}
      mute={() => node.setSounding(!node.sounding)}
    />
  );
};

export default SoundGrid;
