import Node from './node.js';
import { sum } from './util.js';

class RatioNode extends Node {
  constructor({ timeStr, jsonData } = {}) {
    super({ });
    if (timeStr) {
      this.setTime(timeStr);
    }
  }

  setTime(str) {
    let times = str.split(' ');
    times = times.map(Number).filter(x => x);
    const period = times.shift();
    const timeSum = sum(times);
    const ratio = period / timeSum;
    times = times.map(n => n * ratio);
    this._aspects.times = times;
    this._aspects.statuses.map(_ => 'on');
    this._setAbsoluteTimes();
  }
}

export default RatioNode;
