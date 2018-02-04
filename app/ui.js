var log = document.getElementById('log');
var file = document.getElementById('file');
var canvas = document.getElementById('canvas');
var btn = document.getElementById('play_pause');
var dbg_btn = document.getElementById('debug_on_off');

var chunks = [];
var mediaRecorder = new MediaRecorder(dest.stream);
mediaRecorder.ondataavailable = function(evt) { chunks.push(evt.data); };
mediaRecorder.start();
          
update_sound_blob();
          
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
          json = [];
          logToJson.counter = 0;
          
          file.play();
          mediaRecorder.resume();
          
          btn.innerHTML = "Pause";
      }
      else {
          file.pause();
          btn.innerHTML = "Play";

          mediaRecorder.requestData();
          mediaRecorder.pause();
          
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