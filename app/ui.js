var log = document.getElementById('log');
var file = document.getElementById('file');
var canvas = document.getElementById('canvas');
var btn = document.getElementById('play_pause');
var dbg_btn = document.getElementById('debug_on_off');

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
  if(file.paused) {
      json = [];
      logToJson.counter = 0;
      
      file.play();
      btn.innerHTML = "Pause";
  }
  else {
      file.pause();
      btn.innerHTML = "Play";
  }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouse = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}