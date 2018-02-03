var mouse;

// return square of the length of two point
function length_sq(j, k) {
    return (j.x-k.x)*(j.x-k.x)
         + (j.y-k.y)*(j.y-k.y)
}

function dot_product(j, k) {
    return k.x * j.x + k.y * j.y;
}

function is_valid_point(j) {
    return point_status[j] == 1
        && point_speed[j] > 0
        && point_id_followed[j] == 255
        && point_direction[j].x != Infinity
        && point_direction[j].y != Infinity;
}

function random_position(canvas) {
    return {
        x:Math.floor(Math.random()*canvas.width),
        y:30+Math.floor(Math.random()*(canvas.height-60))
    }; 
}

function prune_oflow_points(ctx) {
    var n = point_count;
    var i=0;
    var sound = 0;
    for(; i < n; ++i) {
        if(point_status[i] == 1) {
            var velocity = {x:prev_xy[i<<1]-curr_xy[i<<1], y:prev_xy[(i<<1)+1]-curr_xy[(i<<1)+1]}
            
            var speed = Math.floor(Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y));
                speed = Math.min(Math.max(0,speed),255);
            
            point[i] = {x:prev_xy[i<<1], y:prev_xy[(i<<1)+1]}
            point_direction[i] = {x:velocity.x/speed, y:velocity.y/speed};
            point_speed[i] = speed;

            if(speed > win_size)
                point_status[i] = 0;
            else if (debug)
                draw_line(ctx, prev_xy[i<<1], prev_xy[(i<<1)+1], point_direction[i], speed, "green");
        }
    }
}