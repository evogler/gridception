import React, { useState, useEffect } from 'react';
import GridCell from './GridCell.jsx';

const updateArray = (arr, idx, update) => {
  const res = arr.slice();
  res[idx] = typeof(update) === 'function' ? update(res[idx]) : res[idx];
  return res;
};

const HorizontalGrid = ({ length }) => {
  const xRange = [...new Array(length)].map((_, i) => i);

  const [state, setState] = useState(xRange.map(i => ['off', 'on'][i % 2]));

  const handleClick = (index) => setState(updateArray(state, index, (val) => val === 'on' ? 'off' : 'on'));

  return (
    <div>
      {xRange.map(i => (
        <GridCell key={i} index={i} status={state[i]} active={i === 3} click={handleClick} />
      ))}
    </ div>
  );
};



export default HorizontalGrid;
