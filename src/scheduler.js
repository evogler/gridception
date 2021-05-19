import { playSound, audioCtx } from './webaudio.js';

window.ac = audioCtx;

class Scheduler {
  constructor() {
    this.audioCtx = audioCtx;
    this.bpm = 480;
    this.parts = [];
    this.eventLoopPeriod = 50; // ms
    this.eventBufferSize = 100; // ms
    this.warmupTime = 100; // ms offset at start to allow first notes to play;
    this.playing = false;
    this.id = Math.floor(Math.random() * 1e8);
    this.timeListeners = [];
    this.timePublishInterval = 50; // ms
  }

  addPart(part) {
    this.parts.push(part);
  }

  setBpm(bpm) {
    this.bpm = bpm;
  }

  click() {
    if (!this.playing) {
      this.play();
    } else {
      this.stop();
    }
  }

  play() {
    console.log('PLAY');
    if (this.playing) {
      return;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
      console.log('AUDIOCTX RESUMED!!!');
    }
    this.playing = true;
    this.startTime = this.audioCtx.currentTime;
    this.lastEventWindowEnd = 0;
    this._eventLoop();
    this._publishTimeLoop();
    document.querySelector('.button').textContent = 'STOP';
  }

  stop() {
    this.playing = false;
    this.pauseTime = this._now();
    document.querySelector('.button').textContent = 'PLAY';
  }

  addTimeListener(fn) {
    this.timeListeners.push(fn);
  }

  _publishTimeLoop() {
    const now = this.playing ? this._now() : this.pauseTime;
    let time = this._realTimeToMusicTime(now);
    time -= this.warmupTime / 1000;
    this.timeListeners.forEach(fn => fn(time));
    if (this.playing) {
      setTimeout(this._publishTimeLoop.bind(this), this.timePublishInterval);
    }
  }

  _now() {
    // returns current time in seconds
    return this.audioCtx.currentTime - this.startTime;
  }

  _getEventsInWindow(startTime, endTime) {
    const events = [];
    for (const part of this.parts) {
      for (event of part.getEventsInTimeWindow(startTime, endTime)) {
        events.push(event);
      }
    }
    // console.log('events', events);
    return events;
  }

  _realTimeToMusicTime(time) {
    const musicTime = time * (this.bpm / 60);
    return musicTime;
  }

  _musicTimeToAudioCtxTime(time) {
    const realTime = time * (60 / this.bpm);
    return realTime;
  }

  _eventLoop() {
    const startRealTime = this.lastEventWindowEnd;
    const endRealTime = this._now() + this.eventBufferSize / 1000;
    const startMusicTime = this._realTimeToMusicTime(startRealTime);
    const endMusicTime = this._realTimeToMusicTime(endRealTime);
    const events = this._getEventsInWindow(startMusicTime, endMusicTime);
    // console.log('startMusicTime', startMusicTime, 'endMusicTime', endMusicTime);
    // console.log('events', events);
    events.forEach((e) => {
      // { time, status, sound, indexFn }
      const time = e.time;
      const status = e.statuses;
      const sound = e.sounds;
      const callback = e.callbacks;
      const eventTime = this._musicTimeToAudioCtxTime(time) + this.warmupTime / 1000;

      if (callback) {
        const delay = (eventTime - this._now()) * 1000;
        const visualOffset = 25;
        setTimeout(callback, delay + visualOffset);
      }

      if (status === 'on') {
        if (eventTime > this._now()) {
          playSound(sound, eventTime + this.startTime, 1, 1);
        } else {
          console.warn('Dropped note:', sound, time, eventTime);
        }
      }
    });
    this.lastEventWindowEnd = endRealTime;
    if (this.playing) {
      setTimeout(this._eventLoop.bind(this), this.eventLoopPeriod);
    }
  }
};

export default Scheduler;
