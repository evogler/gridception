import React from 'react';

const Line = ({ coords, extraClass = null }) => {
  let [x1, y1, x2, y2] = coords;
  const padding = 0;
  // const margin = 5;
  const margin = 0;
  x1 -= padding;
  y1 -= padding;
  x2 -= margin;
  y2 -= margin;
  const w = x2 - x1;
  const h = y2 - y1;
  const rot = Math.atan2(h, w);
  const dist = Math.sqrt(w ** 2 + h ** 2)
  const transX = x1;
  const transY = y1;
  const width = dist + 'px';
  const transform = `translate(${transX}px, ${transY}px) rotate(${rot}rad)`;
  const classStr = ["line", extraClass].join(' ');
  return (
    <div className={classStr} style={{width, transform}} />
  )
}

export default Line;
