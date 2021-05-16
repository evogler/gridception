import React, { useState, useEffect } from 'react';

const Grid = ({ length }) => {
  const xRange = [...new Array(length)].map((_, i) => i);

  useEffect(() => {
    console.log('xRange', xRange);
  }, []);

  return (
    <div>

      {xRange.map(x => (
        <span>X</span>
      ))}
    </ div>
  );
};



export default Grid;

