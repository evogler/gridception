import React, { useState, useEffect } from 'react';
import { eventBus, on } from '../eventbus.js';

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}


const useGui = (audio) => {
  const [actives, setActives] = useState(() => Object.fromEntries(Object.values(audio.nodes).map(node => [node.id, 1])));
  const [currentTime, setCurrentTime] = useState(0);

  on('currentPlayTime', (({ time }) => setCurrentTime(time)));

  const buttonClick = () => { eventBus.next({ code: 'playStop' }) };

  const [coords, setCoords] = useState(
    Object.fromEntries(Object.entries(audio.nodes).map(([k, v]) => [k, v._coords]))
  );
  const updateCoords = id => val => { setCoords({ ...coords, [id]: val }); };
  const parentCoords = id => {
    if ([0, 5].includes(id)) {
      return [coords[id][0] + 245, coords[id][1] + 55];
    }
    return [coords[id][0] + 12, coords[id][1] + 12];
  }
  const childCoords = id => {
    if ([0, 5].includes(id)) {
      return [coords[id][0] + 15, coords[id][1] + 12];
    }
    return [coords[id][0] + 12, coords[id][1] + 12];
  }
  const forceUpdate = useForceUpdate();

  return {
    actives, setActives, currentTime, setCurrentTime, buttonClick,
    updateCoords, setCoords, coords, childCoords, parentCoords, forceUpdate,
  };
};

export default useGui;
