import React, { useState } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const SoundGrid = ({ label, node }) => {
  return (
    <HorizontalGrid
      label="time"
      status={node._aspects.statuses}
      update={i => {
        node.updateIn('statuses', i, toggle);
        console.log(node._aspects.statuses);
      }}
      active={-1}
    />
  );
};

export default SoundGrid;

