import Node from './node.js';
import { sum } from './util.js';

class RatioNode extends Node {
  constructor({ timeStr, jsonData } = {}) {
    super({ });
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

  setTime(str) {
    // debugger;
    console.log("setTime", str);
    this._text = str;
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
