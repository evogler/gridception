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
  const [wires, setWires] = useState({});
  useEffect(() => {
    on('currentPlayTime', (({ time }) => setCurrentTime(time)));

    on('setParent', ({ childId, parentId }) => {
      setWires(wires => ({ ...wires, [childId]: parentId }));
    });
  }, []);

  const buttonClick = () => { eventBus.next({ code: 'playStop' }) };

  const [coords, setCoords] = useState({});
  window.coords = coords;
  const updateCoords = id => val => { setCoords(coords => ({ ...coords, [id]: val })); };

  const getWires = () => {
    const res = [];
    for (const [child, parent] of Object.entries(wires)) {
      res.push([coords[parent][0] + 25,
                coords[parent][1] + 25,
                coords[child][0] + 25,
                coords[child][1] + 25]);
    }
    return res;
  }
  const removeWiresForNode = (id) => {
    setWires(wires => {
      return Object.fromEntries(
        Object.entries(wires)
        .filter(([k, v]) => Number(k) !== id && Number(v) !== id));
    });
  };
  const forceUpdate = useForceUpdate();

  return {
    actives, setActives, currentTime, setCurrentTime, buttonClick,
    updateCoords, setCoords, coords, forceUpdate, wires, getWires,
    removeWiresForNode,
  };
};

export default useGui;
