import React, { useState } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const HitsGrid = ({ label, node }) => {
  return (
    <HorizontalGrid
      label="time"
      status={node._aspects.statuses}
      update={i => {
        node.updateIn('statuses', i, toggle);
      }}
      active={-1}
    />
  );
};

export default HitsGrid;

