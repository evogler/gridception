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
    document.querySelector('.button').textContent = 'STOP';
  }

  stop() {
    console.log('STOP');
    this.playing = false;
    document.querySelector('.button').textContent = 'PLAY';
  }

  _now() {
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
    const startRealTime = this.lastEventWindowEnd;
    const endRealTime = this._now() + this.eventBufferSize / 1000;
    const startMusicTime = this._realTimeToMusicTime(startRealTime);
    const endMusicTime = this._realTimeToMusicTime(endRealTime);
    const events = this._getEventsInWindow(startMusicTime, endMusicTime);
    events.forEach(({ time, status, sound, indexFn }) => {
      const eventTime = this._musicTimeToAudioCtxTime(time) + this.warmupTime / 1000;

      if (indexFn) {
        const delay = (eventTime - this._now()) * 1000;
        const visualOffset = 25;
        setTimeout(indexFn, delay + visualOffset);
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
