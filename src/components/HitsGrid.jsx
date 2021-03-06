import React, { useState, useEffect } from 'react';
import HorizontalGrid from './HorizontalGrid.jsx';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const HitsGrid = ({ coords, label, node, updateCoords }) => {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    node.setActiveListener(setActive);
  }, []);

  return (
    <HorizontalGrid
      label={label}
      status={node._aspects.statuses}
      update={i => { node.updateIn('statuses', i, toggle); }}
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

export default HitsGrid;

