import React from 'react';

const ConnectIcon = ({ startWireDrag }) => (
  <div
    className="wire-connector undraggable"
    onMouseDown={startWireDrag}
  >
    P
  </div>
);

export default ConnectIcon;
