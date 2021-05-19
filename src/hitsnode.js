import Node from './node.js';

class HitsNode extends Node {
  constructor({ times, jsonData } = {}) {
    super({ times, jsonData })
  }

  set(aspect, values) {
    this._aspects[aspect] = values;
    if (aspect === 'times' || aspect === 'statuses') {
      this._setAbsoluteTimes();
    }
  }

  _setAbsoluteTimes() {
    const times = this._aspects.times;
    this._absoluteTimes = [0];
    times.forEach(time => this._absoluteTimes.push(this._absoluteTimes.slice(-1)[0] + time));
    this._timePeriod = this._absoluteTimes.pop();
    this._absoluteTimes = this._absoluteTimes.filter((_, idx) => this._aspects.statuses[idx] !== 'off');
    console.log(this._absoluteTimes);
  }
}

export default HitsNode;
