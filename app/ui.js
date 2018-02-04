var log = document.getElementById('log');
var file = document.getElementById('file');
var canvas = document.getElementById('canvas');
var btn = document.getElementById('play_pause');
var dbg_btn = document.getElementById('debug_on_off');
var audio = document.getElementById('audio');

var chunks = [];
var mediaRecorder = new MediaRecorder(dest.stream);
mediaRecorder.ondataavailable = function(evt) { chunks.push(evt.data); };
mediaRecorder.start();
          
var debug = false;
function debug_on_off(){
    debug = !debug;
    if(debug) {
        dbg_btn.innerHTML = "Debug off";
    }
    else {
        dbg_btn.innerHTML = "Debug on";
    }
}

function play_pause() {
    try {
      if(file.paused) {
          
          audio.style.display = "none";
          
          json = [];
          logToJson.counter = 0;
          
          file.play();
          mediaRecorder.start();
          
          btn.innerHTML = "Pause";
      }
      else {
          audio.style.display = "block";
          
          file.pause();
          btn.innerHTML = "Play";

          mediaRecorder.requestData();
          mediaRecorder.stop();
          
          update_sound_blob();
      }
    }
    catch(e) {
        console.log(e);
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouse = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function update_sound_blob() {
    var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    var audioTag = document.createElement('audio');
    document.querySelector("audio").src = URL.createObjectURL(blob);
}

mediaRecorder.onstop = function(evt) {
    // Make blob out of our blobs, and open it.
    var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    var audioTag = document.createElement('audio');
    document.querySelector("audio").src = URL.createObjectURL(blob);
};