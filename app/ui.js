var file = document.getElementById('file');
var btn = document.getElementById('play_pause');

var debug = false;
function set_debug(bool){
    debug = bool;
}

function play_pause() {
  if(file.paused) {
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