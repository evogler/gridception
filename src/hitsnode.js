import Node from './node.js';

class HitsNode extends Node {
  constructor({ length, jsonData } = {}) {
    console.log('***', jsonData)
    super({ jsonData });
    this.type = 'hitsNode';
    if (!jsonData) {
      this._aspects.times = new Array(length).fill(1);
      this._aspects.statuses = new Array(length).fill('on');
    }
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
    let times = [];
    const hitCount = times.length;

    let absoluteTimes = [0];
    times.forEach(time => absoluteTimes.push(absoluteTimes.slice(-1)[0] + time));
    let timePeriod = absoluteTimes.pop();

    const scaleRatio = hitCount / timePeriod;
    timePeriod = hitCount;
    times = times.map(time => time * scaleRatio);

    this._absoluteTimes = times;
    this._timePeriod = timePeriod;
    console.log({ absoluteTimes });

    console.log(this._absoluteTimes, this._timePeriod);
    this._resetTimeCache();
    this._children.forEach(ch => ch._resetTimeCache());
  }
}

export default HitsNode;
