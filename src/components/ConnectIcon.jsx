import React, { useState, useEffect } from 'react';
import useConnectWire from '../useConnectWire.js';
import { on } from '../eventbus.js';

const ConnectIcon = ({ id, relation }) => {
  const parent = relation === 'PARENT';
  const connectingTo = parent ? 'CHILD' : 'PARENT';
  const label = parent ? 'P' : 'C';
  const [active, setActive] = useState(false);
  const startWireDrag = useConnectWire();
  const [available, setAvailable] = useState(true);
  const [otherId, setOtherId] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered.');
    on('startWireDrag', (event) => {
      const { fromId, connectingTo } = event;
      console.log({ id, fromId, relation, parent, connectingTo },
         'startWireDrag rec');

      if (connectingTo !== relation || fromId === id) {
        setAvailable(false);
        return;
      }
      setAvailable(true);
      setOtherId(fromId);
      console.log(id, 'ready to connect to', fromId);
    });

    on('stopWireDrag', (e) => stopWireDrag(e));
  }, []);

  let stopWireDrag;

  useEffect(() => {
    console.log('updating useEffect based on active', {active, otherId});
    stopWireDrag = event => {
      console.log({ otherId, active });
      if (active) {
        console.log('CONNECTION MADE!', { id, otherId, relation });
      }
      setAvailable(true);
      setActive(false);
      console.log(id, 'not connecting');
    };
  }, [active, otherId]);


  const handleMouseOver = e => {
    console.log({ id, label }, 'I got moused over!');
    if (available) {
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
