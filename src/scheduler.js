import { playSound, audioCtx } from './webaudio.js';

window.ac = audioCtx;

class Scheduler {
  constructor() {
    this.audioCtx = audioCtx;
    this.bpm = 200;
    this.parts = [];
    this.eventLoopPeriod = 500; // ms
    this.eventBufferSize = 2000; // ms
    this.playing = false;
  }

  addPart(part) {
    this.parts.push(part);
  }

  setBpm(bpm) {
    this.bpm = bpm;
  }

  play() {
    console.log('play button');
    if (this.playing) {
      return;
    }
    this.playing = true;
    this.startTime = this.now();
    this.lastEventWindowEnd = 0;
    this._eventLoop();
  }

  now() {
    return this.audioCtx.currentTime - this.startTime;
  }

  _getEventsInWindow(startTime, endTime) {
    const events = [];
    for (const part of this.parts) {
      for (event of part(startTime, endTime)) {
        events.push(event);
      }
    }
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
    console.log('event loop');
    const startRealTime = this.lastEventWindowEnd;
    const endRealTime = this.now() + this.eventBufferSize;
    const startMusicTime = this._realTimeToMusicTime(startRealTime);
    const endMusicTime = this._realTimeToMusicTime(endRealTime);

    console.log(this.audioCtx.currentTime);

    const events = this._getEventsInWindow(startMusicTime, endMusicTime);
    events.forEach(({ time, status, sound }) => {
      if (status === 'off') {
        return;
      }
      const eventTime = this._musicTimeToAudioCtxTime(time);
      console.log(eventTime);
      if (eventTime > this.now()) {
        playSound(sound, eventTime, 1, 1);
      }
    });
    this.lastEventWindowEnd = endRealTime;
    setTimeout(this._eventLoop.bind(this), this.eventLoopPeriod);
  }
};

export default Scheduler;
