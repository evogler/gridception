import React, { useState } from 'react';

const toggle = (x) => x === 'on' ? 'off' : 'on';

const RatioBox = ({ label, node }) => {
  return (
    <div className="ratio-box">
      <span className="horizontal-grid-label">{label}:</span>
      <textarea
        onChange={e => {
          node.setTime(e.target.value);
          console.log(e.target.value);
        }}
      >
        1 : 1
      </textarea>
    </div>
  );
};

export default RatioBox;
