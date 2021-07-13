import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { from, fromEvent, Subject } from 'rxjs';
// import { filter } from 'rxjs/operators';

const eventBus = new Subject();

const on = (code, fn) =>
  eventBus
    .pipe(filter(e => e.code === code))
    .subscribe(fn);

const onId = (id, code, fn) => {
  // console.log('onId called with', id, code);
  eventBus
    .pipe(filter(e => {
      return (Number(e.id) === Number(id)) && (e.code === code);
    }))
    .subscribe(fn);
  };

const send = (code, obj) => {
  eventBus.next({ code, ...obj });
};

export { eventBus, on, onId, send };

// eventBus.subscribe(e => console.log('EB', e));
eventBus.subscribe(e => console.log('EB'));

window.eventBus = eventBus;
window.send = send;