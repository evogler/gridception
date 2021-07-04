import { on, send } from './eventbus.js';
import Node from './node.js';
import RatioNode from './rationode.js';

class Graph {
  constructor() {
    this._nodes = {};
  }

  addNode(node) {
    const id = node.id;
    if (this._nodes[id]) {
      throw new Error('Tried to add node with pre-existing ID.');
    }
    this._nodes[node.id] = node;
  }

  allNodes() {
    return Object.values(this._nodes);
  }

  get(id) {
    return this._nodes[id];
  }
}

const graph = new Graph();

on('newSoundGrid', (event) => {
  const node = new Node();
  graph.addNode(node);
  send('soundGridCreated', { id: node.id });
  setTimeout(() => {
    send('setAspect', { id: node.id, aspect: 'sounds', values: [event.sound] });
    const statuses = ['on', ...new Array(Math.floor(Math.random() * 5 + 3)).fill('off')];
    send('setAspect', { id: node.id, aspect: 'statuses', values: statuses });
  }, 0);
});

on('newRatioNode', () => {
  const node = new RatioNode();
  graph.addNode(node);
  send('ratioNodeCreated', { id: node.id });
  setTimeout(() => {
    send('setTime', { id: node.id, time: '1 1 1 1'});
  });
})

on('setAspect', (event) => {
  const { id, aspect, values } = event;
  graph.get(id).set(aspect, [...values]);
});

on('setTime', (event) => {
  const { id, text } = event;
  graph.get(id).setTime(text);
})

on('lengthen', ({ id }) => {
  graph.get(id).lengthen();
  send('setAspect', { id, aspect: 'statuses', values: graph.get(id)._aspects.statuses });
});

on('shorten', ({ id }) => {
  graph.get(id).shorten();
  send('setAspect', { id, aspect: 'statuses', values: graph.get(id)._aspects.statuses });
});

on('setParent', ({ childId, parentId }) => {
  console.log('gonna setParent', { childId, parentId });
  const parent = graph.get(parentId);
  const child = graph.get(childId);
  child.setParent(parent);
  parent.addChild(child);
});

export default graph;

window.graph = graph;
