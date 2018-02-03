// settings

var win_size = 25,
    max_iterations = 30,
    epsilon = 0.01,
    min_eigen = 0.001;
    
var point_count = 200;
var win_size_sq = win_size*win_size;

// frame datas

var curr_img_pyr = new jsfeat.pyramid_t(3);
var prev_img_pyr = new jsfeat.pyramid_t(3);
var prev_xy = new Float32Array(point_count*2);
var curr_xy = new Float32Array(point_count*2);

// point datas

var point_status = new Uint8Array(point_count);
var point_id_followed = new Uint8Array(point_count);
var point_id_follower_count = new Uint8Array(point_count);
var point_speed = new Float32Array(point_count);
var point_direction = [];
var point = [];

// prepare / reset functions

function prepare_image(ctx) {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var pixels = imageData.data;
     
    var gray_img = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8_t | jsfeat.C1_t);
    var code = jsfeat.COLOR_RGBA2GRAY;
    
    // double buffer swap
    var _pyr = prev_img_pyr;
    prev_img_pyr = curr_img_pyr;
    curr_img_pyr = _pyr;
    var _pt_xy = prev_xy;
    prev_xy = curr_xy;
    curr_xy = _pt_xy;
    
    jsfeat.imgproc.grayscale(imageData.data, canvas.width, canvas.height, curr_img_pyr.data[0], code);
    
    curr_img_pyr.build(curr_img_pyr.data[0], true);
}

function reset_static_point() {
  for(var i=0; i<point_count; i++){
      if(point_speed[i] < 0.1 || point_status[i] == 0) {
          var coords = random_position(canvas); 
          curr_xy[i<<1] = coords.x;
          curr_xy[(i<<1)+1] = coords.y;
      }
  }
}

function reset_followed_points() {
    for(var j = 0; j < point_count; ++j) {
        point_id_followed[j] = 255;
        point_id_follower_count[j] = 0;
    }
}