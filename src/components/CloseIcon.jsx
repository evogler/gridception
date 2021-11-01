import React from 'react';
import { send } from '../eventbus.js';

const CloseIcon = ({ id }) => {
  const close = () => {
    console.log('CLOSE!');
    send('deleteNode', { id });
  };

  return (
    <div
      className="close-icon"
      onClick={close}
    >X</div>
  );
};

export default CloseIcon;
