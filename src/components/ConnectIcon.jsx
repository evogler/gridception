import React, { useState } from 'react';

const ConnectIcon = ({ id, startWireDrag, parent = true }) => {
  const listening = true;
  const label = parent ? 'P' : 'C';
  const [active, setActive] = useState(false);

  const handleMouseOver = e => {
    console.log({ id, label }, 'I got moused over!');
    if (listening) {
      setActive(true);
    }
  };

  const handleMouseOut = e => {
    console.log({ id, label }, 'Bye!');
    setActive(false);
  };

  return (
    <div
      className={[
        'wire-connector',
        active && 'wire-connector-active',
        parent ? 'wire-connector-bottom' : 'wire-connector-top',
        'undraggable'
      ].join(' ')}
      onMouseDown={startWireDrag}
      onMouseOver={listening && handleMouseOver}
      onMouseOut={listening && handleMouseOut}
    >
      {label}
    </div>
  );
};

export default ConnectIcon;
