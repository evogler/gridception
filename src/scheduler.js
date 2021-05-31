import { playSound, audioCtx } from './webaudio.js';
import log from './logger.js';

window.ac = audioCtx;

class Scheduler {
  constructor() {
    this.audioCtx = audioCtx;
    this.bpm = 400;
    this.parts = [];
    this.eventLoopPeriod = 50; // ms
    this.eventBufferSize = 200; // ms
    this.warmupTime = 115; // ms offset at start to allow first notes to play;
    this.playing = false;
    this.id = Math.floor(Math.random() * 1e8);
    this.timeListeners = [];
    this.timePublishInterval = 50; // ms
    window.setBpm = this.setBpm.bind(this);
  }

  addPart(part) {
    this.parts.push(part);
    console.log('scheduler.addPart', part);
  }

  reset() {
    this.parts = [];
    this.timeListeners = [];
  }

  setBpm(bpm) {
    this.bpm = bpm;
    const now = this._now();
    this.startTimeBeats = this.audioCtx.currentTime;
    this.startTimeSeconds = now;
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
    this.startTimeSeconds = this.audioCtx.currentTime;
    this.startTimeBeats = 0;
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
    return this.audioCtx.currentTime - this.startTimeSeconds;
  }

  _getEventsInWindow(startTimeSeconds, endTime) {
    let events = [];
    for (const part of this.parts) {
      for (event of part.getEventsInTimeWindow(startTimeSeconds, endTime)) {
        event.sounding = part.sounding;
        events.push(event);
      }
    }
    // console.log('events', events);
    return events;
  }

  _realTimeToMusicTime(time) {
    const musicTime = time * (this.bpm / 60) + this.startTimeBeats;
    return musicTime;
  }

  _musicTimeToAudioCtxTime(time) {
    const realTime = (time - this.startTimeBeats) * (60 / this.bpm);
    return realTime;
  }

  _eventLoop() {
    const startRealTime = this.lastEventWindowEnd;
    const endRealTime = this._now() + this.eventBufferSize / 1000;
    const startMusicTime = this._realTimeToMusicTime(startRealTime);
    const endMusicTime = this._realTimeToMusicTime(endRealTime);
    const events = this._getEventsInWindow(startMusicTime, endMusicTime);
    const seenEvents = new Set();
    events.forEach((e) => {
      const time = e.time;
      const status = e.statuses;
      const sound = e.sounds;
      const sounding = e.sounding;
      const callback = e.callbacks;
      const setActive = e.setActive;
      const eventTime = this._musicTimeToAudioCtxTime(time) + this.warmupTime / 1000;

      if (setActive) {
        const delay = (eventTime - this.startTimeSeconds) * 1000;
        const visualOffset = 1;
        setActive();
      }

      log.log('event');
      if (status === 'on' && sounding) {
        const identity = JSON.stringify([time, status, sound]);
        if (!seenEvents.has(identity)) {
          seenEvents.add(identity);
          if (eventTime > this._now()) {
            playSound(sound, eventTime + this.startTimeSeconds, 1, 1);
          } else {
            console.warn('Dropped note:', sound, time, eventTime);
          }
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
