import Node from '../node.js';
import RatioNode from '../rationode.js';
import HitsNode from '../hitsnode.js';

const jazzRideStr = `{
  "bpm": 425,
  "parts":[

  {"id":0,"label":"grid 1","aspects":{"times":[1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[1,3],"sounding":false,"coords":[100,160],"text":"1","type":"ratioNode"},

  {"id":1,"label":"ride","aspects":{"times":[1,1,1,1],"sounds":["ride"],"volumes":[1],"rates":[1],"statuses":["on","off","on","on"]},"parent":0,"children":[],"sounding":true,"coords":[430,113],"type":"node"},

  {"id":2,"label":"kick","aspects":{"times":[1,1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":5,"children":[],"sounding":true,"coords":[428,375],"type":"node"},

  {"id":3,"label":"hat","aspects":{"times":[1,1,1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["off","off","on","off"]},"parent":0,"children":[],"sounding":true,"coords":[428,203],"type":"node"},

  {"id":4,"label":"rim","aspects":{"times":[1,1,1,1,1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","off"]},"parent":5,"children":[],"sounding":true,"coords":[431,288],"type":"node"},

  {"id":5,"label":"grid 2","aspects":{"times":[1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[2,4],"sounding":false,"coords":[100,350],"text":"1","type":"ratioNode"}

]}`;

const funkyBeatStr = `{
  "bpm": 400,
  "parts": [
    {"id":0,"aspects":{"times":[16],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[1,3],"sounding":false,"coords":[100,160],"text":"1","type":"ratioNode"},
    {"id":1,"aspects":{"times":[1],"sounds":["ride"],"volumes":[1],"rates":[1],"statuses":["on"]},"parent":0,"children":[],"sounding":false,"coords":[430,113],"type":"node"},
    {"id":2,"aspects":{"times":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["on","off","off","on","on","off","off","on","on","off","off","on","on","on","on","off"]},"parent":5,"children":[],"sounding":true,"coords":[411,418],"type":"node"},
    {"id":3,"aspects":{"times":[1,1,1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["on","off","on","off"]},"parent":0,"children":[],"sounding":false,"coords":[428,203],"type":"node"},
    {"id":4,"aspects":{"times":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off","on","off","off","off","off","off","off","off","on","on","off","off"]},"parent":5,"children":[],"sounding":true,"coords":[412,307],"type":"node"},
    {"id":5,"aspects":{"times":[1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[2,4,6,7],"sounding":false,"coords":[100,350],"text":"1","type":"ratioNode"},
    {"id":6,"aspects":{"times":[1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["on","off","on","on"]},"parent":5,"children":[],"sounding":true,"coords":[370,618],"type":"node"},
    {"id":7,"aspects":{"times":[1,1,1,1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["on","off","off","off","off","off","off","off","off","off","off"]},"parent":5,"children":[],"sounding":false,"coords":[413,517],"type":"node"}
  ]}`;

const bossaStr = `{
  "bpm": 335,
  "parts": [
    {"id":0,"aspects":{"times":[0.9333333333333333,0.9333333333333333,1.0666666666666667,1.0666666666666667],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[1,3],"sounding":false,"coords":[70,160],"text":"1","type":"ratioNode"},
    {"id":1,"aspects":{"times":[1,1,1,1],"sounds":["ride"],"volumes":[1],"rates":[1],"statuses":["off","off","off","off"]},"parent":0,"children":[],"sounding":true,"coords":[382,143],"type":"node"},
    {"id":2,"aspects":{"times":[1,1,1,1],"sounds":["kick"],"volumes":[1],"rates":[1],"statuses":["on","off","off","on"]},"parent":5,"children":[],"sounding":true,"coords":[316,493],"type":"node"},
    {"id":3,"aspects":{"times":[1,1,1,1],"sounds":["hat"],"volumes":[1],"rates":[1],"statuses":["on","on","on","on"]},"parent":0,"children":[],"sounding":true,"coords":[380,254],"type":"node"},
    {"id":4,"aspects":{"times":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["off","off","on","off","off","on","off","off","on","off","off","on","off","off","on","off"]},"parent":5,"children":[],"sounding":true,"coords":[316,380],"type":"node"},
    {"id":5,"aspects":{"times":[0.9090909090909092,0.9090909090909092,1.0909090909090908,1.0909090909090908],"sounds":["rim"],"volumes":[1],"rates":[1],"statuses":["on"]},"children":[2,4],"sounding":true,"coords":[26,332],"text":"1","type":"ratioNode"}]}`;

// const jsonData = JSON.parse(jazzRideStr);
// const jsonData = JSON.parse(funkyBeat);

const loadFromJson = (jsonData, scheduler) => {
  const nodes = {};

  scheduler.reset();

  for (const json of jsonData) {
    if (json.type === 'node') {
      const n = new Node({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    } else if (json.type === 'ratioNode') {
      const n = new RatioNode({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    } else if (json.type === 'hitsNode') {
      const n = new HitsNode({ jsonData: json });
      nodes[json.id] = n;
      scheduler.addPart(n);
    }
  }

  for (const node of Object.values(nodes)) {
    if (Number.isInteger(node._parent)) {
      node._parent = nodes[node._parent];
    }
    node._children = node._children.map(ch => nodes[ch]);
  }

  for (const node of Object.values(nodes)) {
    node._setAbsoluteTimes();
  }

  return nodes;
};

export { funkyBeatStr, jazzRideStr, bossaStr, loadFromJson };

console.log('$@#$#', JSON.parse(funkyBeatStr).parts);