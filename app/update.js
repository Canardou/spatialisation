function update_frame() {
    if(file.paused)
        return;

    canvas.width = file.videoWidth;
    canvas.height = file.videoHeight;
    
    reset_static_point();
    reset_followed_points();
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(file, 0, 0);
    
    try {
        if(mouse)
            draw_circle(ctx, mouse.x, mouse.y);
            
          var t0 = performance.now();
          
          // copy the current frame and build the DCT
          prepare_image(ctx);
              
          var t1 = performance.now();
          
          // apply the kanade algorithm with previous and current frame
          jsfeat.optical_flow_lk.track(
              prev_img_pyr, curr_img_pyr,
              prev_xy, curr_xy, point_count,
              win_size, max_iterations,
              point_status, epsilon, min_eigen
          );
              
          var t2 = performance.now();
          
          // filter incorrect kanade points
          // to fast agains win_size,  ...
          prune_oflow_points(ctx);
              
          var t3 = performance.now();
          
          // merge point when it's almost at the same direction vectors
          // distance point to point < winsize
          var objects = build_object_and_merge_vectors();
          draw_objects(ctx, objects);
          remove_inner_objects();
          
          var t4 = performance.now();
          
          update_sound_from_objects(ctx);
          
          var t5 = performance.now();
          //should iterate a second time to merge close found vector and keep them in memory in between frame (kalman ?)
          
          draw_log_time(t0, t1, t2, t3, t4, t5);
    }
    catch (e){
        console.log(e);
    }
}

function update_sound_from_objects(ctx) {
    sources[0].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
    sources[1].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
    
    log.innerHTML = "";
    draw_log_objects(objects, point_speed);
    
    var src_color = ["red", "yellow"];
    
    for(var i=0; i < objects.length; ++i) {
        var id = objects[i].id;
        if(point_status[id] == 1 && point_id_follower_count[id] > 3) {
            draw_line(ctx, point[id].x, point[id].y, point_direction[id], point_speed[id], "red");
            
            var width = objects[i].right-objects[i].left;
            var height =  objects[i].bottom-objects[i].top;
            var size = width * height;
            
            var src_id = -1;
            
            if(size<3000)
                src_id = 1;
            else
                src_id = 0;
                
            sources[src_id].panner.setPosition(point[id].x,point[id].y,0);
            //if(navigator.userAgent.indexOf("Firefox"))
            //    sources[src_id].panner.setVelocity(point_direction[id].x, point_direction[id].y, 0);
            sources[src_id].gain.gain.setValueAtTime(point_speed[id], contexteAudio.currentTime);
            draw_object(ctx, objects[i], src_color[src_id], "2", "15px");
        }
    }
}