import { Subject } from 'rxjs';
// import { from, fromEvent, Subject } from 'rxjs';
// import { filter } from 'rxjs/operators';

const eventBus = new Subject();

export default eventBus;
