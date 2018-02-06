var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
var listener = contexteAudio.listener;

var dest = contexteAudio.createMediaStreamDestination();

var audio_files = ['steps.wav','waka.wav','car.wav'];
var sources = [];

for(var i = 0; i<audio_files.length; ++i) {
    var panner = contexteAudio.createPanner();
    var gain = contexteAudio.createGain();
    
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    // init at max distance to remove starting noise
    panner.setPosition(0,0,20000);
    
    gain.gain.setValueAtTime(0.0, contexteAudio.currentTime);
    gain.connect(panner);
    
    panner.connect(contexteAudio.destination);
    panner.connect(dest);
    
    sources.push({
        panner: panner,
        filename: audio_files[i],
        gain: gain
    });
}

let buffer = new Buffer(contexteAudio, audio_files, function() {
    for(var i = 0; i<buffer.getSoundCount(); ++i) {
        var steps = new Sound(contexteAudio, buffer.getSoundByIndex(i));
        var source = steps.source;
        
        source.connect(sources[i].gain);
        steps.play();
    }
});

buffer.loadAll();

function init_audio() {
    if(listener.forwardX) {
      listener.forwardX.value = 0;
      listener.forwardY.value = 0;
      listener.forwardZ.value = -1;
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    }
    else {
      listener.setOrientation(0,0,-1,0,1,0);
    }
    
    listener.positionX.value = 352/2;
    listener.positionY.value = 328/2;
    listener.positionZ.value = 50;
}