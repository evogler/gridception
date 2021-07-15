import React, { useState, useEffect } from 'react';
import useConnectWire from '../useConnectWire.js';
import { send, on } from '../eventbus.js';

const ConnectIcon = ({ id, relation }) => {
  const parent = relation === 'PARENT';
  const connectingTo = parent ? 'CHILD' : 'PARENT';
  const label = parent ? 'P' : 'C';
  const [active, setActive] = useState(false);
  const startWireDrag = useConnectWire();
  const [available, setAvailable] = useState(true);
  const [otherId, setOtherId] = useState(null);

  useEffect(() => {
    on('startWireDrag', onStartWireDrag);
    on('stopWireDrag', stopWireDrag);
  }, []);

  const onStartWireDrag = event => {
    const { fromId, connectingTo } = event;
    if (connectingTo !== relation || fromId === id) {
      setAvailable(false);
      return;
    }
    setAvailable(true);
    setOtherId(fromId);
  }

  const stopWireDrag = event => {
    setAvailable(true);
    setActive(false);
  };

  const handleMouseOver = e => {
    if (available) {
      setActive(true);
      send('wireDragAdd', { id, relation });
    }
  };

  const handleMouseOut = e => {
    if (active) {
      send('wireDragRemove', { id });
    }
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
      onMouseDown={e => startWireDrag({ fromId: id, connectingTo, e })}
      onMouseOver={available ? handleMouseOver : undefined}
      onMouseOut={available ? handleMouseOut : undefined}
    >
      {label}
      {active ? "T" : "F"}
    </div>
  );
};

export default ConnectIcon;
