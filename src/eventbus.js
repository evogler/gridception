import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { from, fromEvent, Subject } from 'rxjs';
// import { filter } from 'rxjs/operators';

const eventBus = new Subject();

window.eventBus = eventBus;

const on = (code, fn) =>
  eventBus
    .pipe(filter(e => e.code === code))
    .subscribe(fn);

const send = (code, obj) => {
  eventBus.next({ code, ...obj });
};

export { eventBus, on, send };
