class Buffer {

  constructor(context, urls, callback) {  
    this.context = context;
    this.urls = urls;
    this.buffer = [];
    this.count = 0;
    this.callback = callback;
  }

  loadSound(url, index) {
    let request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    let thisBuffer = this;
    request.onload = function() {
      thisBuffer.context.decodeAudioData(request.response, function(buffer) {
        thisBuffer.buffer[index] = buffer;
        thisBuffer.count++;
        if(thisBuffer.count == thisBuffer.urls.length) {
          thisBuffer.loaded();
        }       
      });
    };
    request.send();
  };

  loadAll() {
    this.urls.forEach((url, index) => {
      this.loadSound(url, index);
    })
  }

  loaded() {
    this.callback();
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }

}

class Sound {

  constructor(context, buffer) {
    this.context = context;
    this.buffer = buffer;
    this.init();
  }

  init() {
    //this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    //this.source.connect(this.gainNode);
    //this.gainNode.connect(this.context.destination);
  }

  play() {
    this.source.start(this.context.currentTime);
    this.source.loop = true;
  }  

  /*stop() {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
    this.source.stop(this.context.currentTime + 0.5);
  }*/
}