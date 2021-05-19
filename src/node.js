import { uniqueId } from './util.js';
import nodeDefaults from './nodedefaults.js';

class Node {
  constructor({ times, jsonData } = {}) {
    this._parent = null;
    this._aspects = nodeDefaults();
    if (times) {
      this._aspects.times = times;
    }
    this._sounding = true;
    this._timeCache = [];
    this.id = uniqueId();
    console.log('Creating new Node', this.id);
  }

  setParent(parent) {
    // Can be set to null.
    this._parent = parent;
  }

  setSounding(sounding) {
    this._sounding = sounding;
  }

  set(aspect, values) {
    this._aspects[aspect] = values;
    if (aspect === 'times') {
      this._setAbsoluteTimes(values);
    }
  }

  updateIn(aspect, index, fn) {
    this._aspects[aspect][index] = fn(this._aspects[aspect][index]);
  }

  _setAbsoluteTimes(times) {
    this._absoluteTimes = [0];
    times.forEach(time => this._absoluteTimes.push(this._absoluteTimes.slice(-1)[0] + time));
    this._timePeriod = this._absoluteTimes.pop();
  }

  _getOwnTime(index) {
    let time = this._timePeriod * Math.floor(index / this._absoluteTimes.length);
    time += this._absoluteTimes[index % this._absoluteTimes.length];
    return time;
  }

  _extendTimeCache(endTime) {
    while (endTime >= (this._timeCache.length - 1)) {
      let index = this._timeCache.length;
      let newTime = this._getOwnTime(index);
      if (this._parent) {
        newTime = this._parent.getTime(newTime);
      }
      this._timeCache.push(newTime);
    }
  }

  _getAspectsAtIndex(index, aspects) {
    const res = {};
    for (const aspect in this._aspects) {
      const arr = this._aspects[aspect];
      res[aspect] = arr[index % arr.length];
    }
    return res;
  }

  getTime(time) {
    this._extendTimeCache(time);
    if (time % 1 === 0) {
      return this._timeCache[Math.floor(time)];
    }
    let t0 = this._timeCache[Math.floor(time)];
    let t1 = this._timeCache[Math.ceil(time)];
    let weight = time % 1;
    return weight * t1 + (1 - weight) * t0;
  }

  getEventsInTimeWindow(startTime, endTime, aspects = null) {
    this._extendTimeCache(endTime);
    const res = [];
    let i = this._timeCache.length - 1;
    while (this._timeCache[i] >= endTime) {
      i -= 1;
    }
    while (this._timeCache[i] >= startTime && i >= 0) {
      const event = this._getAspectsAtIndex(i, aspects);
      event.time = this._timeCache[i];
      res.unshift(event);
      i -= 1;
    }
    // console.log('Node.GEITW', this.id, startTime, endTime, res);
    return res;
  }
}

export default Node;
