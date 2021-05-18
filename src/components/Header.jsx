import React from 'react';

const Header = ({ buttonClick, currentTime }) => {
  const time = Math.round(currentTime * 10) / 10;
  return (
    <div className="header">
      <button className="button" onClick={buttonClick}>PLAY</button>
      <span>Beat: {time}</span>
    </div>
  );
};

export default Header;
