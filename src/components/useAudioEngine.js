import React, { useState, useEffect } from 'react';
import Scheduler from '../scheduler.js';
import { jazzRideStr, loadFromJson } from './fromJson.js';

const useAudioEngine = () => {
  const [scheduler] = useState(() => new Scheduler());
  const [nodes, setNodes] = useState(() => []);
  useEffect(() => { window.nodes = nodes; }, []);
  const setBpm = bpm => { scheduler.setBpm(bpm); }
  const save = () => {
    const json = Object.values(nodes).map(node => node.toJson());
    console.log(JSON.stringify(json));
  }
  return { scheduler, nodes, setNodes, setBpm, save };
}

export default useAudioEngine;
