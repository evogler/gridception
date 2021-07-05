import React, { useState, useEffect } from 'react';
import Scheduler from '../scheduler.js';
import graph from '../graph.js';
import { jazzRideStr, loadFromJson } from './fromJson.js';
import { eventBus } from '../eventbus.js';

const useAudioEngine = () => {
  // const [scheduler] = useState(() => new Scheduler());
  let scheduler;
  useEffect(() => {
    scheduler = new Scheduler(graph);
    window.scheduler = scheduler;
  }, []);
  const [nodes, setNodes] = useState(() => []);
  useEffect(() => { window.nodes = nodes; }, []);
  const setBpm = bpm => eventBus.next({ code: 'setBpm', bpm });
  const save = () => {
    const json = Object.values(nodes).map(node => node.toJson());
    console.log(JSON.stringify(json));
  }
  return { scheduler, setNodes, setBpm, save };
}

export default useAudioEngine;
