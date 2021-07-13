import React, { useState, useEffect } from 'react';
import { send } from './eventbus.js';

const useConnectWire = () => {
  // const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const startDragging = ({ x, y }) => {
    send('startWireDrag', { x, y })
    // setDragging(true);
  }

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
    document.removeEventListener('mouseup', handleMouseUp, false);
    document.removeEventListener('mousemove', handleMouseMove, false);
  };

  const startWireDrag = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    startDragging({ x, y });
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove, false);
  };

  return startWireDrag;
};

export default useConnectWire;
