import { uniqueId } from './util.js';
import nodeDefaults from './nodedefaults.js';

class Node {
  constructor({ times, jsonData } = {}) {
    if (jsonData) {
       const { id, aspects, parent, children, sounding } = jsonData;
       this._parent = parent;
       this._children = children;
       this._aspects = aspects;
       this._sounding = sounding;
       this.id = id;
       return;
    }

    this._parent = null;
    this._children = [];
    this._aspects = nodeDefaults();
    if (times) {
      this._aspects.times = times;
    }
    this._sounding = true;
    this._timeCache = [];
    this.id = uniqueId();
    // console.log('Creating new Node', this.id);
  }

  toJson() {
    return JSON.stringify({
      id: this.id,
      aspects: this._aspects,
      parent: this._parent?.id,
      children: this._children.map(ch => ch.id),
      sounding: this._sounding,
      coords: this._coords,
    })
  }

  setParent(parent) {
    this._parent = parent;
    parent.addChild(this);
  }

  addChild(child) {
    this._children.push(child);
  }

  setSounding(sounding) {
    this._sounding = sounding;
  }

  get sounding() {
    return this._sounding;
  }

  set(aspect, values) {
    this._aspects[aspect] = values;
    if (aspect === 'times') {
      this._setAbsoluteTimes();
    }
  }

  updateIn(aspect, index, fn) {
    this._aspects[aspect][index] = fn(this._aspects[aspect][index]);
    if (aspect === 'times') {
      this._setAbsoluteTimes();
    }
  }

  lengthen() {
    this._aspects.times.push(this._aspects.times.slice(-1)[0]);
    this._aspects.statuses.push('off');
  }

  shorten() {
    if (this._aspects.times.length > 1) {
      this._aspects.times.pop();
    }
    if (this._aspects.statuses.length > 1) {
      this._aspects.statuses.pop();
    }
  }

  _setAbsoluteTimes() {
    const times = this._aspects.times;
    this._absoluteTimes = [0];
    times.forEach(time => this._absoluteTimes.push(this._absoluteTimes.slice(-1)[0] + time));
    this._timePeriod = this._absoluteTimes.pop();
    this._resetTimeCache();
    this._children.forEach(ch => ch._resetTimeCache());
  }

  _getOwnTime(index) {
    let time = this._timePeriod * Math.floor(index / this._absoluteTimes.length);
    time += this._absoluteTimes[index % this._absoluteTimes.length];
    return time;
  }

  _resetTimeCache() {
    this._timeCache = [];
    this._children.map(ch => ch._resetTimeCache());
    // console.log('reset time cache', this.id);
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
