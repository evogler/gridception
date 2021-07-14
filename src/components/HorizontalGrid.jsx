import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import useConnectWire from '../useConnectWire.js';
import DragIcon from './DragIcon.jsx';
import ConnectIcon from './ConnectIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = (props) => {
  let { status, update, label, active, coords,
    lengthen, shorten, mute, id } = props;

  // startCoords = node._coords ? node._coords : startCoords;
  const drag = useDrag({ id });
  const wireDrag = useConnectWire();
  const [x, y] = coords;
  const [muted, setMuted] = useState(false);
  const toggleMute = () => {
    mute();
    setMuted(!muted);
  };

  // useEffect(() => {
    // console.log(node?.label, node?.type, node?._aspects?.statuses);
  // }, []);

  return (
    <div
      className={['horizontal-grid', muted ? 'muted' : ''].join(' ')}
      style={{ left: x, top: y }}
    >
      <DragIcon startDrag={drag} />
      <ConnectIcon id={id} startWireDrag={wireDrag} parent={true}/>
      <ConnectIcon id={id} startWireDrag={wireDrag} parent={false}/>
      <span className="horizontal-grid-label">{label}</span>
      <span className="grid-button" onClick={lengthen}>+</span>
      <span className="grid-button" onClick={shorten}>-</span>
      <span className="grid-button" onClick={toggleMute}>m</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]}
        active={i === active /* &&  status[i] === 'on' */}
        click={() => {update(i); /* forceUpdate() */;}} />
      ))}
    </ div>
  );
};

export default HorizontalGrid;
