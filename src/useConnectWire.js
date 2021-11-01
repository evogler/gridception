import React, { useState, useEffect } from 'react';
import { send } from './eventbus.js';

const useConnectWire = () => {
  // const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const stopDragging = () => {
    send('stopWireDrag');
    // setDragging(false);
  }

  const handleMouseMove = (e) => {
    // console.log('moving mouse', e);
    const x = e.clientX;
    const y = e.clientY;
    send('updateWireDrag', { x, y });
  };

  const handleMouseUp = () => {
    stopDragging();
    Object.entries(listeners).forEach(([type, fn]) =>
      document.removeEventListener(type, fn, false));
  };

  const startWireDrag = ({ fromId, connectingTo, e }) => {
    const x = e.clientX;
    const y = e.clientY;
    send('startWireDrag', { x, y, fromId, connectingTo });
    // setDragging(true);
    Object.entries(listeners).forEach(([type, fn]) =>
      document.addEventListener(type, fn, false));
  };

  const listeners = {
    'mouseup': handleMouseUp,
    'mousemove': handleMouseMove,
  }

  return startWireDrag;
};

export default useConnectWire;
