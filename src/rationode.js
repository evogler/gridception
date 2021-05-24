import Node from './node.js';
import { sum } from './util.js';

class RatioNode extends Node {
  constructor({ timeStr, jsonData } = {}) {
    super({});
    this.type = 'ratioNode';
    if (jsonData) {
      const { id, aspects, parent, children, sounding, text, coords, label } = jsonData;
      this._parent = parent;
      this._children = children;
      this._aspects = aspects;
      this._sounding = sounding;
      this._text = text;
      this._coords = coords;
      this.label = label;
      this.id = id;
      return;
    }


    if (timeStr) {
      this.setTime(timeStr);
    }
    console.log('RatioNode constructor should have aspects', this._aspects);
  }

  toJson() {
    return {
      id: this.id,
      aspects: this._aspects,
      parent: this._parent?.id,
      children: this._children.map(ch => ch.id),
      sounding: this._sounding,
      coords: this._coords,
      text: this._text,
      type: 'ratioNode',
    };
  }

  _getNumbers(str) {
    return [...str.matchAll(/([0-9.]+)/g)].map(x => Number(x[0]));
  }

  _interpretRatioNodeStr(str) {
    const groups = str.split(',');
    const res = [];
    for (let group of groups) {
      let beats, length;
      if (~group.indexOf(':')) {
        beats = this._getNumbers(group.split(':')[0]);
        length = this._getNumbers(group.split(':')[1])[0];
      } else {
        beats = this._getNumbers(group);
        length = beats.length;
      }
      const ratio = length / beats.reduce((sum, n) => sum + n, 0);
      beats = beats.map(n => n * ratio);
      res.push(...beats);
    }
    return res;
  };

  setTime(str) {
    // debugger;
    console.log("setTime", str);
    const times = this._interpretRatioNodeStr(str);
    this._aspects.times = times;
    this._aspects.statuses.map(_ => 'on');
    this._setAbsoluteTimes();
  }
}

export default RatioNode;
