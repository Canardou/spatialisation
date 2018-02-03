var file = document.getElementById('file');
var btn = document.getElementById('play_pause');

var debug = false;
function setDebug(bool){
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