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

function draw_log_object(id, object, speed) {
    if(!debug)
        return;
        
    log.innerHTML +=
        "<div>"
        + "Object id : " + id + "<br>"
        + "Speed : " + Math.floor(speed)
        + "<br>"
        +     "x:" + Math.floor(object.left)
        +   ", y:" + Math.floor(object.top)
        +   ", w:" + Math.floor(object.right-object.left)
        +   ", h:" + Math.floor(object.bottom-object.top)
      + "</div>";
}

function draw_log_time(t0, t1, t2, t3, t4, t5) {
    if(!debug)
        return;
        
    log.innerHTML +=
        "<div style='position:absolute;display:block;top:20px;left:400px'>"
      + "<br>Preparation donnees : "      + Math.floor(t1-t0)
      + "<br>Lukas kanade : "             + Math.floor(t2-t1)
      + "<br>Tri des points : "           + Math.floor(t3-t2)
      + "<br>Rassemblement des points : " + Math.floor(t4-t3)
      + "<br>Affichage et son : "         + Math.floor(t5-t4)
      + "</div>";
}