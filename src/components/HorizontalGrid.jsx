import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = ({ status, update, forceUpdate, label, node, active,
  startCoords, updateCoords, lengthen, shorten, mute }) => {

  startCoords = node._coords ? node._coords : startCoords;
  const [x, y, drag] = useDrag(...startCoords, node, updateCoords);

  const [muted, setMuted] = useState(false);
  const toggleMute = () => {
    mute();
    setMuted(!muted);
  };

  useEffect(() => {
    console.log(node?.label, node?.type, node?._aspects?.statuses);
  }, []);

  return (
    <div
      className={['horizontal-grid', muted ? 'muted' : ''].join(' ')}
      style={{ left: x, top: y }}
    >
      <DragIcon startDrag={drag} />
      <span className="horizontal-grid-label">{label}:</span>
      <span onClick={lengthen}>+</span>
      <span onClick={shorten}>-</span>
      <span onClick={toggleMute}>m</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]} active={i === active && status[i] === 'on'} click={() => {update(i); forceUpdate();}} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
