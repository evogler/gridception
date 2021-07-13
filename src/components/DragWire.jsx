import React, { useState, useEffect } from 'react';
import Line from './Line.jsx';
// import useConnectWire from '../useConnectWire.js';
import { send, on } from '../eventbus.js';

const DragWire = () => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState(() => [0, 0, 100, 100]);

  const startWireDrag = ({ x, y }) => {
    setCoords([x, y, x, y]);
    setVisible(true);
    console.log('startWireDrag received', { x, y, visible });
  };

  const updateWireDrag = ({ x, y }) => {
    setCoords(coords => [...coords.slice(0, 2), x, y]);
    console.log('updateWireDrag received', {
      x, y, visible,
      coords: JSON.stringify(coords)
    });
  };

  const stopWireDrag = () => {
    setVisible(false);
  };

  useEffect(() => {
    on('startWireDrag', startWireDrag);
    on('updateWireDrag', updateWireDrag);
    on('stopWireDrag', stopWireDrag);
  }, []);

  return (
    visible
      ? <Line coords={coords} extraClass={'drag-line'} />
      : null
  );
};

export default DragWire;
