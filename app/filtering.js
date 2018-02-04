function prune_oflow_points(ctx) {
    var n = point_count;
    var i=0;
    var sound = 0;
    for(; i < n; ++i) {
        if(point_status[i] == 1) {
            var velocity = {x:prev_xy[i<<1]-curr_xy[i<<1], y:prev_xy[(i<<1)+1]-curr_xy[(i<<1)+1]}
            
            var speed = vector_length(velocity);
            
            point_speed[i] = speed;
            point[i] = {x:prev_xy[i<<1], y:prev_xy[(i<<1)+1]}
            point_direction[i] = {
                x:velocity.x/speed,
                y:velocity.y/speed
            };

            if(speed > win_size || speed < 1)
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
                        bottom: point[j].y,
                        direction: {},
                        count: 1
                    };
                    objects.push(object);
                }
                
                object.left = Math.min(object.left,point[k].x);
                object.top = Math.min(object.top,point[k].y);
                object.right = Math.max(object.right,point[k].x);
                object.bottom = Math.max(object.bottom,point[k].y);
                
                point_id_followed[k] = j
                point_id_followed[j] = j
                
                point[j].x = (point[j].x+point[k].x)/2;
                point[j].y = (point[j].y+point[k].y)/2;
                
                point_direction[j].x = (point_direction[j].x+point_direction[k].x)/2;
                point_direction[j].y = (point_direction[j].y+point_direction[k].y)/2;
                
                var length = vector_length(point_direction[j]);
                point_direction[j].x /= length;
                point_direction[j].y /= length;
                point_speed[j] = (point_speed[k]+point_speed[j])/2;
                
                var width = (object.right-object.left);
                var height = (object.bottom-object.top);
                
                object.size = width*height;
                object.middle = {x:width/2+object.left,y:height/2+object.top};
                object.direction.x = point_direction[j].x;
                object.direction.y = point_direction[j].y;
                object.speed = point_speed[j];
                object.meta_id = Infinity;
                object.timestamp = 0;
                object.valid = true;
                object.count++;
            }
        }
    }
    
    return objects;
}

function merge_objects() {
    var tmp_win_size = win_size;
    
    objects = objects.filter(e => (e.timestamp < 3));
    
    for(var k=0; k<5; ++k){
        for(var i=0; i < objects.length; ++i) {
            var current = objects[i];
            
            if(current.valid){
                for(var j=0; j < objects.length; ++j) {
                    if( j != i ){
                        var other = objects[j];
                        if(other.valid && is_rect_inside(current, other, tmp_win_size)) {
                            let dot_result = dot_product(current.direction, other.direction);
                            
                            if(dot_result > 0.5) {
                                if (other.meta_id != 0 && other.meta_id < current.meta_id){
                                    current.meta_id = other.meta_id;
                                }
                                else {
                                    current.top = Math.min(current.top,other.top);
                                    current.left = Math.min(current.left,other.left);
                                    current.right = Math.max(current.right,other.right);
                                    current.bottom = Math.max(current.bottom,other.bottom);
                                    current.count += other.count;
                                }
                                other.valid = false;
                            }
                        }
                    }
                }
            }
        }
    }
    //removed invalid items
    tracked_objects = objects.filter(e => (e.valid && e.count > 3));
}

function update_tracked_objects(){
    for(var i=0; i < tracked_objects.length; ++i){
        var object = tracked_objects[i];
        var vx = object.direction.x*object.speed;
        var vy = object.direction.y*object.speed;
        object.left -= vx;
        object.right -= vx;
        object.top -= vy;
        object.bottom -= vy;
        object.middle.x -= vx;
        object.middle.y -= vy;
        object.timestamp++;
        if(object.meta_id == Infinity)
            object.meta_id = tracked_objects_count++;
    }
}