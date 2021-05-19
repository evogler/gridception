import Node from './node.js';

class HitsNode extends Node {
  constructor({ length, jsonData } = {}) {
    super({ jsonData });
    this._aspects.times = new Array(length).fill(1);
    this._aspects.statuses = new Array(length).fill('on');
    this._setAbsoluteTimes();
  }

  set(aspect, values) {
    this._aspects[aspect] = values;
    if (aspect === 'times' || aspect === 'statuses') {
      this._setAbsoluteTimes();
    }
  }

  updateIn(aspect, index, fn) {
    this._aspects[aspect][index] = fn(this._aspects[aspect][index]);
    console.log(aspect);
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
    console.log(this._absoluteTimes, this._timePeriod);
    this._resetTimeCache();
    this._children.forEach(ch => ch._resetTimeCache());
  }
}

export default HitsNode;
