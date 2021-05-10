const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const drums = [
  'kick',
  'snare',
  'hat',
  'sidestick-2',
  // 'ride-bell',
  // 'ride'
];

const sampleLags = {
  'kick': 0.026,
  'snare': 0.0293,
  'hat': 0.0267,
  'sidestick': 0.0245,
  // 'ride-bell': 0.0395,
  // 'ride': 0.0443,
};

const drumCodes = {
  'k': 'kick',
  's': 'snare',
  'h': 'hat',
  'd': 'sidestick-2',
  // 'b': 'ride-bell',
  // 'r': 'ride',
};

const buffers = {};

const sampleFolder = '/public/samples/';

const onDecode = (buffer, fname) => {
  buffers[fname] = buffer;
  console.log('loaded', fname);
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

const playSound = (fname, startTime, vol, rate) => {
  const bufS = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  bufS.buffer = buffers[fname];
  bufS.playbackRate.value = rate;
  gain.gain.value = vol;
  bufS.connect(gain);
  gain.connect(audioCtx.destination);
  bufS.start(startTime);
  // bufS.start();
  return bufS;
};

///////////////////////////

loadSomeDrums();

const nextSound = (() => {
  let pos = 0;
  const sounds = ['kick', 'hat', 'snare', 'hat'];
  return () => {
    const res = sounds[pos];
    pos = (pos + 1) % sounds.length;
    return res;
  }
})();

const play = () => {
  const now = audioCtx.currentTime;
  const playTime = now + 0;
  playSound(nextSound(), playTime, 1, 1)
};

const handleKey = key => {
  const drumPart = drumCodes[key];
  if (drumPart) {
    playSound(drumPart, 0, 1, 1);
  }
};

document.body.addEventListener('keypress', e => handleKey(e.key));

console.log('webaudio.js loaded.');
