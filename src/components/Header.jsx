import React, { useState } from 'react';

const Header = ({ buttonClick, currentTime, save, bpm, setBpm, handleLoadButton }) => {
  const time = Math.round(currentTime * 10) / 10;

  const _setBpm = e => {
    const newBpm = e.target.value
    setBpm(newBpm);
  };

  return (
    <div className="header">
      <button className="button" onClick={buttonClick}>PLAY</button>
      <button className="button" onClick={save}>SAVE</button>
      <button className="button" onClick={handleLoadButton}>LOAD</button>
      <input type="range" className="slider" min="100" max="800"
        value={bpm} onInput={_setBpm}></input>
      <input type="text" value={bpm} onInput={_setBpm}
        style={{ width: '32px' }}
      ></input>
      <span style={{ paddingLeft: '16px' }}>Beat: {time}</span>
    </div>
  );
};

export default Header;
