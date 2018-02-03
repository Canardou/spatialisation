var file = document.getElementById('file');
var canvas = document.getElementById('canvas');
    
var curr_img_pyr = new jsfeat.pyramid_t(3);
var prev_img_pyr = new jsfeat.pyramid_t(3);
var win_size = 25,
    max_iterations = 30,
    epsilon = 0.01,
    min_eigen = 0.001;
    
var point_count = 200;
var win_size_sq = win_size*win_size;

var prev_xy = new Float32Array(point_count*2);
var curr_xy = new Float32Array(point_count*2);
var point_status = new Uint8Array(point_count);
var point_id_followed = new Uint8Array(point_count);
var point_id_follower_count = new Uint8Array(point_count);
var point_speed = new Float32Array(point_count);
var point_direction = [];
var point = [];
var objects = [];
var reset_point = 0;

function reset_static_point() {
  for(var i=0; i<point_count; i++){
      if(point_speed[i] < 0.1 || point_status[i] == 0){
          var coords = random_position(canvas); 
          curr_xy[i<<1] = coords.x;
          curr_xy[(i<<1)+1] = coords.y;
      }
  }
}

function on_update()
{
  if(file.paused)
      return;

  canvas.width = file.videoWidth;
  canvas.height = file.videoHeight;
  
  reset_static_point();
  
  var ctx = canvas.getContext('2d');
  ctx.drawImage(file, 0, 0);
  try{
      if(mouse)
          draw_circle(ctx, mouse.x, mouse.y);
          
        var t0 = performance.now();
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
        var pixels = imageData.data;
         
        var gray_img = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8_t | jsfeat.C1_t);
        var code = jsfeat.COLOR_RGBA2GRAY;
        
        var _pyr = prev_img_pyr;
        prev_img_pyr = curr_img_pyr;
        curr_img_pyr = _pyr;
        var _pt_xy = prev_xy;
        prev_xy = curr_xy;
        curr_xy = _pt_xy;
        
        jsfeat.imgproc.grayscale(imageData.data, canvas.width, canvas.height, curr_img_pyr.data[0], code);
        
        curr_img_pyr.build(curr_img_pyr.data[0], true);
        var t1 = performance.now();
        jsfeat.optical_flow_lk.track(prev_img_pyr, curr_img_pyr, prev_xy, curr_xy, point_count, win_size, max_iterations, point_status, epsilon, min_eigen);
        var t2 = performance.now();

        //draw points remove too high speed (win size = 20)
        prune_oflow_points(ctx);
        var t3 = performance.now();
        //find same direction vectors (distance point to point < winsize)
        //almost same direction
        
        for(var j = 0; j < point_count; ++j) {
            point_id_followed[j] = 255;
            point_id_follower_count[j] = 0;
        }
        
        objects = [];
        
        for(var j = 0; j < point_count/2; ++j) {
            if(!is_valid_point(j))
                continue;
            
            for(var k = j+1; k < point_count; ++k) {
                if(!is_valid_point(k))
                    continue;
                
                let distance = length_sq(point[j], point[k]);
                let dot_result = dot_product(point_direction[k], point_direction[j]);
                let speed_diff = Math.abs(point_speed[k]-point_speed[j]);
                
                if( dot_result > 0.8 && distance < win_size_sq*16 && speed_diff < 2){
                    var object = objects.find(x => x.id === j);
                    if(object == undefined){
                        object = {id:j, left:point[j].x, 
                                            top:point[j].y,
                                            right:point[j].x,
                                            bottom:point[j].y
                        };
                        objects.push(object);
                    }
                    object.left = Math.min(object.left,point[k].x);
                    object.top = Math.min(object.top,point[k].y);
                    object.right = Math.max(object.right,point[k].x);
                    object.bottom = Math.max(object.bottom,point[k].y);
                    point_id_followed[k] = j
                    point_id_followed[j] = j
                    point_id_follower_count[j]++;
                    point[j].x = (point[j].x+point[k].x)/2;
                    point[j].y = (point[j].y+point[k].y)/2;
                    point_direction[j].x = (point_direction[j].x+point_direction[k].x)/2;
                    point_direction[j].y = (point_direction[j].y+point_direction[k].y)/2;
                    var length = Math.floor(Math.sqrt(point_direction[j].x*point_direction[j].x + point_direction[j].y*point_direction[j].y));
                    point_direction[j].x /= length;
                    point_direction[j].y /= length;
                    point_speed[j] = (point_speed[k]+point_speed[j])/2;
                }
            }
        }
        
        var t4 = performance.now();
        //If inside of another object, remove
        for(var i=0; i < objects.length; ++i) {
            if(debug){
                draw_object_debug(ctx, objects[i], "purple", "1", "8px");
            }
        }
        var tmp_win_size = win_size;
        for(var k=0; k<5; ++k){
            for(var i=0; i < objects.length/2; ++i) {
                var current = objects[i];
                for(var j=i+1; j < objects.length; ++j) {
                    var other = objects[j];
                    if(current.top-tmp_win_size<other.top && current.bottom+tmp_win_size>other.bottom && current.left-tmp_win_size<other.left && current.right+tmp_win_size>other.right){
                        let dot_result = point_direction[current.id].x * point_direction[other.id].x + point_direction[current.id].y * point_direction[other.id].y;
                        
                        if( dot_result > 0){
                            point_status[other.id] = 0;
                            current.top = Math.min(current.top,other.top);
                            current.left = Math.min(current.left,other.left);
                            current.right = Math.max(current.right,other.right);
                            current.bottom = Math.max(current.bottom,other.bottom);
                        }
                    }
                }
            }
            tmp_win_size += win_size;
        }

        document.getElementById("log").innerHTML = "";
        
        var max_speed = 0;
        sources[0].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
        sources[1].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
        
        for(var i=0; i < objects.length; ++i) {
            var id = objects[i].id;
            if(point_status[id] == 1 && point_id_follower_count[id] > 3) {
                if(debug)
                    draw_line(ctx, point[id].x, point[id].y, point_direction[id], point_speed[id], "red");
                
                var width = objects[i].right-objects[i].left;
                var height =  objects[i].bottom-objects[i].top;
                var size = width * height;
                
                if(size<3000) {
                    sources[1].panner.setPosition(point[id].x,point[id].y,0);
                    sources[1].gain.gain.setValueAtTime(5.0, contexteAudio.currentTime);
                    if(debug)
                        draw_object_debug(ctx, objects[i], "yellow", "2", "15px");
                }
                else if(max_speed < point_speed[i]){
                    max_speed = point_speed[id]
                    sources[0].panner.setPosition(point[id].x,point[id].y,0);
                    //sources[0].panner.setVelocity(point_direction[id].x, point_direction[id].y, 0);//Firefox only
                    sources[0].gain.gain.setValueAtTime(point_speed[id], contexteAudio.currentTime);
                    if(debug)
                        draw_object_debug(ctx, objects[i], "red", "2", "15px");
                }
                if(debug)
                    draw_debug_log_object(id, objects[i], point_speed[i])
            }
        }
        
        var t5 = performance.now();
        if(debug)
            draw_debug_log_time(t0, t1, t2, t3, t4, t5);
        //should iterate a second time to merge close found vector and keep them in memory in between frame (kalman ?)
        
        
  }
  catch (e){
      console.log(e);
  }
}