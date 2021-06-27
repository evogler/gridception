import { on, send } from './eventbus.js';
import Node from './node.js';

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
  send('setAspect', { id: node.id, aspect: 'sounds', values: [event.sound] });
  const statuses = ['on', ...new Array(Math.floor(Math.random() * 5 + 3)).fill('off')];
  send('setAspect', { id: node.id, aspect: 'statuses', values: statuses });

});

on('setAspect', (event) => {
  const { id, aspect, values } = event;
  graph.get(id).set(aspect, values);
});

export default graph;

window.graph = graph;
