class Logger {
  constructor() {
    this.reset();
    this._triggers = {
      // resetTimeCache: 1,
      // event: 100,
      // getEventsInWindow: 29,
    };
  }

  reset() {
    this._log = [];
    this._counter = {};
  }

  log(key, ...val) {
    this._log.push({ key, val, time: new Date() });
    this._counter[key] = (this._counter[key] ?? 0) + 1;
    if (this._triggers[key]) {
      if (this._counter[key] % this._triggers[key] === 0) {
        console.log(key, val, this._counter[key]);
      }
    }
  }

  addTrigger(trigger, rate = 1) {
    this._triggers[trigger] = rate;
  }

  get(key) {
    return this._log.filter(x => x.key === key);
  }

  count(key) {
    return this._counter[key] ?? 0;
  }

  report(reset = false) {
    // const res = {};
    // for (const { key, val, time } of this._log) {
    //   res[key] = (res[key] ?? 0) + 1;
    // }
    const res = this._counter;
    if (reset) {
      this.reset();
    }
    return res;
  }

  printReport(reset = false) {
    Object.entries(this.report(reset)).forEach(x => console.log(x.join(': ')));
    console.log(' ');
  }

  test() {
    console.log('logger test');
  }
}

const logger = new Logger();
logger.log = logger.log.bind(logger);

window.logger = logger;
module.exports = logger;
