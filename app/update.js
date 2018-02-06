function update_frame() {
    if(file.paused){
        draw_log_time(0, 0, 0, 0, 0, 0);
        return;
    }
        
    var t0 = performance.now();
    
    canvas.width = file.videoWidth;
    canvas.height = file.videoHeight;
    
    reset_static_point();
    reset_followed_points();
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(file, 0, 0);
    
    if(mouse)
        draw_circle(ctx, mouse.x, mouse.y);
    
    
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
    objects = build_object_and_merge_vectors();
    
    //Add old objects
    objects = objects.concat(tracked_objects);
    
    draw_objects(ctx, objects);
    merge_objects();
    update_tracked_objects();
    
    var t4 = performance.now();
    
    update_sound_from_objects(ctx);
    
    //should iterate a second time to merge close found vector and keep them in memory in between frame (kalman ?)
    logToJson(tracked_objects);
    var t5 = performance.now();
    draw_log_time(t0, t1, t2, t3, t4, t5);
}

function update_sound_from_objects(ctx) {
    sources[0].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
    sources[1].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
    sources[2].gain.gain.setValueAtTime(0, contexteAudio.currentTime);
    
    log.innerHTML = "";
    draw_log_objects(tracked_objects, point_speed);
    
    var src_color = ["red", "yellow", "blue"];
    
    for(var i=0; i < tracked_objects.length; ++i) {
        var object = tracked_objects[i];
        draw_line(ctx, object.middle.x, object.middle.y, object.direction, object.speed, "red");
        
        var src_id = -1;
        
        if(object.size<3000 && object.bottom-object.top<100 && object.speed > 15)
            src_id = 2;
        else if(object.bottom-object.top<100 && object.size<3000)
            src_id = 1;
        else
            src_id = 0;
            
        sources[src_id].panner.setPosition(object.middle.x,object.middle.y,0);
        //if(navigator.userAgent.indexOf("Firefox"))
        //    sources[src_id].panner.setVelocity(point_direction[id].x, point_direction[id].y, 0);
        sources[src_id].gain.gain.setValueAtTime(object.size/300, contexteAudio.currentTime);
        draw_object(ctx, object, src_color[src_id], "2", "15px", true);
    }
}