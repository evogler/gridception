import React, { useState, useEffect } from 'react';
import { eventBus, on } from '../eventbus.js';

import graph from '../graph.js';

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}


const useGui = (audio) => {
  const [actives, setActives] = useState(() => Object.fromEntries(graph.allNodes()));
  const [currentTime, setCurrentTime] = useState(0);

  on('currentPlayTime', (({ time }) => setCurrentTime(time)));

  const buttonClick = () => { eventBus.next({ code: 'playStop' }) };

  const [coords, setCoords] = useState({});
  window.coords = coords;
  const updateCoords = id => val => { setCoords(coords => ({ ...coords, [id]: val })); };
  const [lines, setLines] = useState([[100, 500, 300, 300]]);
  // const parentCoords = id => {
  //   if ([0, 5].includes(id)) {
  //     return [coords[id][0] + 245, coords[id][1] + 55];
  //   }
  //   return [coords[id][0] + 12, coords[id][1] + 12];
  // }
  // const childCoords = id => {
  //   if ([0, 5].includes(id)) {
  //     return [coords[id][0] + 15, coords[id][1] + 12];
  //   }
  //   return [coords[id][0] + 12, coords[id][1] + 12];
  // }
  const forceUpdate = useForceUpdate();

  return {
    actives, setActives, currentTime, setCurrentTime, buttonClick, lines,
    updateCoords, setCoords, coords, forceUpdate,
  };
};

export default useGui;
