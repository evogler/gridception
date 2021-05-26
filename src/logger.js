class Logger {
  constructor() {
    this._log = [];
  }

  const log(...args) {
    this._log.push([new Date(), args]);
  }
}

const logger = new Logger();

module.exports = logger;
