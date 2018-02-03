function prune_oflow_points(ctx) {
    var n = point_count;
    var i=0;
    var sound = 0;
    for(; i < n; ++i) {
        if(point_status[i] == 1) {
            var velocity = {x:prev_xy[i<<1]-curr_xy[i<<1], y:prev_xy[(i<<1)+1]-curr_xy[(i<<1)+1]}
            
            var speed = Math.floor(vector_length(velocity));
                speed = Math.min(Math.max(0,speed),255);
            
            point[i] = {x:prev_xy[i<<1], y:prev_xy[(i<<1)+1]}
            point_direction[i] = {x:velocity.x/speed, y:velocity.y/speed};
            point_speed[i] = speed;

            if(speed > win_size)
                point_status[i] = 0;
            else
                draw_line(ctx, prev_xy[i<<1], prev_xy[(i<<1)+1], point_direction[i], speed, "green");
        }
    }
}

function build_object_and_merge_vectors () {
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
            
            if(dot_result > 0.8 && distance < win_size_sq*16 && speed_diff < 2) {
                var object = objects.find(x => x.id === j);
                
                if(object == undefined) {
                    object = {
                        id:j,
                        left:   point[j].x, 
                        top:    point[j].y,
                        right:  point[j].x,
                        bottom: point[j].y
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
                
                var length = Math.floor(vector_length(point_direction[j]));
                point_direction[j].x /= length;
                point_direction[j].y /= length;
                point_speed[j] = (point_speed[k]+point_speed[j])/2;
            }
        }
    }
    
    return objects;
}

function remove_inner_objects() {
    var tmp_win_size = win_size;
    for(var k=0; k<5; ++k){
        for(var i=0; i < objects.length/2; ++i) {
            var current = objects[i];
            for(var j=i+1; j < objects.length; ++j) {
                var other = objects[j];
                if(is_rect_inside(current, other, tmp_win_size)) {
                    let dot_result = dot_product(point_direction[current.id], point_direction[other.id]);
                    
                    if(dot_result > 0) {
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
}