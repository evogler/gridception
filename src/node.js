import { log } from './logger.js';
import { uniqueId } from './util.js';
import nodeDefaults from './nodedefaults.js';

class Node {
  constructor({ times, jsonData } = {}) {
    this.type = 'node';
    this.id = uniqueId();
    if (jsonData) {
      const { id, aspects, parent, children, sounding, coords, label } = jsonData;
      this._parent = parent;
      this._children = children;
      this._aspects = aspects;
      this._sounding = sounding;
      this._coords = coords;
      this.label = label;
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
  }

  toJson() {
    return {
      id: this.id,
      aspects: this._aspects,
      parent: this._parent?.id,
      children: this._children.map(ch => ch.id),
      sounding: this._sounding,
      coords: this._coords,
      type: 'node',
    };
  }

  setActiveListener(listener) {
    this._activeListener = listener;
  }

  setParent(parent) {
    this._parent = parent;
    parent.addChild(this);
    this._setAbsoluteTimes();
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
    log('setAbsoluteTimes', this._timeCache);
    const times = this._aspects.times;
    this._absoluteTimes = [0];
    times.forEach(time => this._absoluteTimes.push(this._absoluteTimes.slice(-1)[0] + time));
    this._timePeriod = this._absoluteTimes.pop();
    this._resetTimeCache();
    log('setAbsoluteTimes done', this._timeCache);
  }

  _getOwnTime(index) {
    log('getOwnTime', index);
    if (!this._absoluteTimes) {
      this._setAbsoluteTimes();
    }
    let time = this._timePeriod * Math.floor(index / this._absoluteTimes.length);
    time += this._absoluteTimes[index % this._absoluteTimes.length];
    return time;
  }

  _resetTimeCache() {
    log('resetTimeCache', this.label);
    this._timeCache = [];
    this._children.map(ch => ch._resetTimeCache());
  }

  _extendTimeCache(endTime) {
    log('extendTimeCache', endTime, this._timeCache);
    let max = 100;
    while (endTime >= (this._timeCache.slice(-1)[0] ?? 0)
      || endTime >= this._timeCache.length) {
      let index = this._timeCache.length;
      let newTime = this._getOwnTime(index);
      if (this._parent) {
        newTime = this._parent.getTime(newTime);
      }
      if (newTime === undefined) { debugger; }
      this._timeCache.push(newTime);
      max -= 1;
      // if (!max) {
      //   console.log('extendTimeCache maxed out',
      //     endTime,
      //     'this._timeCache.slice(-1)[0]', this._timeCache.slice(-1)[0],
      //     'this._timeCache.length', this._timeCache.length,
      //     );
      //   return;
      // }
    }
  }

  _getAspectsAtIndex(index, aspects) {
    log('getAspectsAtIndex');
    const res = {};
    for (const aspect in this._aspects) {
      const arr = this._aspects[aspect];
      const idx = index % arr.length
      res[aspect] = arr[idx];
      res[aspect + 'Idx'] = idx;
    }
    res.index = index;
    return res;
  }

  getTime(time) {
    log('getTime');
    this._extendTimeCache(time + 0);
    if (time % 1 === 0) {
      return this._timeCache[Math.floor(time)];
    }
    let t0 = this._timeCache[Math.floor(time)];
    let t1 = this._timeCache[Math.ceil(time)];
    let weight = time % 1;
    return weight * t1 + (1 - weight) * t0;
  }

  getEventsInTimeWindow(startTime, endTime, aspects = null) {
    // console.log('getEventsInTimeWindow', startTime, endTime);
    this._extendTimeCache(endTime);
    const res = [];
    let i = this._timeCache.length - 1;
    while (this._timeCache[i] >= endTime) {
      i -= 1;
    }
    while (this._timeCache[i] >= startTime && i >= 0) {
      const event = this._getAspectsAtIndex(i, aspects);
      event.time = this._timeCache[i];
      event.setActive = () => {
        const activeIdx = ((i + 1) % this._aspects.statuses.length);
        if (this._activeListener) {
          this._activeListener(activeIdx);
        }
      };
      res.unshift(event);
      i -= 1;
    }
    return res;
  }
}

export default Node;
