function draw_circle(ctx, x, y) {
    if(!debug)
        return;
        
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function draw_line(ctx, x, y, velocity, speed, color) {
    if(!debug)
        return;
        
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+1+velocity.x*speed,y+1+velocity.y*speed);
    ctx.strokeStyle = color;
    ctx.lineWidth=5;
    ctx.stroke();
}

function draw_objects(ctx, objects) {
    if(!debug)
        return;

    for(var i=0; i < objects.length; ++i)
        draw_object(ctx, objects[i], "purple", "1", "8px");
}

function draw_object(ctx, object, color, thickness, font) {
    if(!debug)
        return;
        
    var width = object.right-object.left;
    var height = object.bottom-object.top;
    var size = width * height;

    ctx.beginPath();
    ctx.lineWidth=thickness;
    ctx.strokeStyle=color;
    ctx.rect(object.left,object.top,width,height);
    ctx.stroke();
    ctx.font = font + "Comic Sans MS";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText("id:" + object.id, object.left, object.top - 15); 
}

function draw_log_objects(objects, speeds) {
    if(!debug)
        return;
        
    function add_row(object, speed) {
        return "<tr><td>" + object.id + "</td><td>" + speed.toFixed(3) + "</td><td>" +
                25
              + "</td></tr>";
    }
        
    var table = 
          "<table style='position:absolute;display:block;top:150px;left:400px;width:300px'>"
        + "<tr><td width='140px'>Object id</td><td width='120px'>Speed</td><td width='150px'>Coords</td></tr>";
        
    for(var i=0; i<objects.length; ++i)
        table += add_row(objects[i], speeds[i]);
    
    table += "</table>";
    
    log.innerHTML += table;
}

function draw_log_time(t0, t1, t2, t3, t4, t5) {
    if(!debug)
        return;
        
    function add_row(title, time) {
        return "<tr><td>" + title + "</td><td style='text-align: right;'>"
             + time.toFixed(3) + "ms</td></tr>"
    }
        
    log.innerHTML +=
       "<table style='position:absolute;display:block;top:10px;left:400px'>"
      + add_row("Preparation donnees",      t1-t0)
      + add_row("Lukas kanade",             t2-t1)
      + add_row("Tri des points",           t3-t2)
      + add_row("Rassemblement des points", t4-t3)
      + add_row("Affichage et son",         t5-t4)
      + "</table>";
}