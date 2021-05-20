import React from 'react';

const Header = ({ buttonClick, currentTime, save }) => {
  const time = Math.round(currentTime * 10) / 10;
  return (
    <div className="header">
      <button className="button" onClick={buttonClick}>PLAY</button>
      <button className="button" onClick={save}>SAVE</button>
      <span>Beat: {time}</span>
    </div>
  );
};

export default Header;
