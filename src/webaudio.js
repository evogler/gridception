const drums = [
  'kick',
  'snare',
  'hat',
  'rim',
  // 'ride-bell',
  'ride'
];

const sampleLags = {
  'kick': 0.026,
  'snare': 0.0293,
  'hat': 0.0267,
  'rim': 0.0245,
  // 'ride-bell': 0.0395,
  'ride': 0.0443,
};

const drumCodes = {
  'k': 'kick',
  's': 'snare',
  'h': 'hat',
  'd': 'rim',
  // 'b': 'ride-bell',
  'r': 'ride',
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// window.audioCtx = audioCtx;

const buffers = {};

const sampleFolder = '/samples/';

const onDecode = (buffer, fname) => {
  buffers[fname] = buffer;
  // console.log('loaded', fname);
};

const onMp3Load = (req, fname) => {
  audioCtx.decodeAudioData(req.response,
    (x => onDecode(x, fname)));
};

const loadAudioFile = (fname) => {
  const req = new XMLHttpRequest();
  const fullName = sampleFolder + fname + '.mp3';
  req.open('GET', fullName);
  req.responseType = 'arraybuffer';
  req.onload = () => (onMp3Load(req, fname));
  req.send();
};

const loadSomeDrums = () => {
  for (const d of drums) {
    loadAudioFile(d);
  }
};

const playSound = (fname, startTime = 0, vol = 1, rate = 1) => {
  const bufS = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  bufS.buffer = buffers[fname];
  bufS.playbackRate.value = rate;
  gain.gain.value = vol;
  bufS.connect(gain);
  gain.connect(audioCtx.destination);
  startTime -= sampleLags[fname];
  bufS.start(startTime);
  // bufS.start();
  return bufS;
};

///////////////////////////

loadSomeDrums();

console.log('webaudio.js loaded.');

export { playSound, audioCtx };
