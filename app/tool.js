var mouse;

// return square of the length of two point
function length_sq(j, k) {
    return (j.x-k.x)*(j.x-k.x)
         + (j.y-k.y)*(j.y-k.y)
}

function dot_product(j, k) {
    return k.x * j.x + k.y * j.y;
}

// return the length of a vector
function vector_length(j) {
    return Math.sqrt(dot_product(j, j));
}

function is_valid_point(j) {
    return point_status[j] == 1
        && point_speed[j] > 0
        && point_id_followed[j] == 255
        && point_direction[j].x != Infinity
        && point_direction[j].y != Infinity;
}

function is_rect_inside(current, other, eps) {
    return current.top    - eps < other.top
        && current.bottom + eps > other.bottom
        && current.left   - eps < other.left
        && current.right  + eps > other.right;
}

function random_position(canvas) {
    return {
        x:Math.floor(Math.random()*canvas.width),
        y:30+Math.floor(Math.random()*(canvas.height-60))
    }; 
}
