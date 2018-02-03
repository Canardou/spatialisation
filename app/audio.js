// crée un contexteaudio
var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();

var panner = contexteAudio.createPanner();
panner.panningModel = 'HRTF';
panner.distanceModel = 'inverse';
panner.refDistance = 1;
panner.maxDistance = 10000;
panner.rolloffFactor = 1;
panner.coneInnerAngle = 360;
panner.coneOuterAngle = 0;
panner.coneOuterGain = 0;

var wakaPanner = contexteAudio.createPanner();
wakaPanner.panningModel = 'HRTF';
wakaPanner.distanceModel = 'inverse';
wakaPanner.refDistance = 1;
wakaPanner.maxDistance = 10000;
wakaPanner.rolloffFactor = 1;
wakaPanner.coneInnerAngle = 360;
wakaPanner.coneOuterAngle = 0;
wakaPanner.coneOuterGain = 0;

var listener = contexteAudio.listener;

let buffer = new Buffer(contexteAudio, ['steps.wav','waka.wav'], function(){
    var steps = new Sound(contexteAudio, buffer.getSoundByIndex(0));
    steps.play();
    var source = steps.source;
    source.connect(gainNode);
    
    var waka = new Sound(contexteAudio, buffer.getSoundByIndex(1));
    waka.play();
    source = waka.source;
    source.connect(wakaNode);
});
buffer.loadAll();

var gainNode = contexteAudio.createGain();
var wakaNode = contexteAudio.createGain();
wakaNode.connect(wakaPanner);
gainNode.connect(panner);
panner.connect(contexteAudio.destination);
wakaPanner.connect(contexteAudio.destination);
gainNode.gain.setValueAtTime(0.0, contexteAudio.currentTime);
wakaNode.gain.setValueAtTime(0.0, contexteAudio.currentTime);

//oscillator.stop(contexteAudio.currentTime + 0.1);