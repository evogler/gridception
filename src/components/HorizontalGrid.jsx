import React, { useState, useEffect } from 'react';
import useDrag from '../usedrag.js';
import DragIcon from './DragIcon.jsx';
import ConnectIcon from './ConnectIcon.jsx';
import CloseIcon from './CloseIcon.jsx';
import GridCell from './GridCell.jsx';

const HorizontalGrid = (props) => {
  let { status, update, label, active, coords,
    lengthen, shorten, muted, toggleMute, id } = props;

  // startCoords = node._coords ? node._coords : startCoords;
  const drag = useDrag({ id });
  const [x, y] = coords;
  const maxLength = 99;
  const gridSizeChange = (e) => {
    const length = e.target.value;
    if (Number(length) && length <= maxLength) {
      send('setLength', { id, length });
    }
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
      <CloseIcon id={id} />
      <ConnectIcon id={id} relation="PARENT" />
      <ConnectIcon id={id} relation="CHILD" />
      <span className="horizontal-grid-label">{label}</span>
      <span className="grid-button" onClick={lengthen}>+</span>
      <span className="grid-button" onClick={shorten}>-</span>
      <input
        type="number"
        min="0" max={maxLength}
        className="grid-size-input"
        onChange={gridSizeChange}
        value={status.length}>
      </input>
      <span className="grid-button" onClick={toggleMute}>m</span>
      {status.map((_, i) => (
        <GridCell key={i} index={i} status={status[i]}
          active={i === active /* &&  status[i] === 'on' */}
          click={() => { update(i); /* forceUpdate() */; }} />
      ))}
      <div className="horizontal-grid-right-edge undraggable"></div>
    </ div>
  );
};

export default HorizontalGrid;
