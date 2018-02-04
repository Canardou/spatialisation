function draw_circle(ctx, x, y) {
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

    for(var i=0; i < objects.length; ++i){
        if(objects[i].timestamp>0)
            draw_object(ctx, objects[i], "purple", "1", "8px");
        else
            draw_object(ctx, objects[i], "cyan", "1", "8px");
    }
}

function draw_object(ctx, object, color, thickness, font, overrideDebug) {
    if(!debug && !overrideDebug)
        return;
        
    var width = object.right-object.left;
    var height = object.bottom-object.top;
    var size = width * height;

    ctx.beginPath();
    ctx.lineWidth=thickness;
    ctx.strokeStyle=color;
    ctx.rect(object.left,object.top,width,height);
    ctx.stroke();
    ctx.font = font + " Comic Sans MS";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText("id:" + object.meta_id, object.left, object.top - 15); 
}

function draw_log_objects(objects) {
    if(!debug)
        return;
        
    function add_row(object) {
        return "<tr>"
             + "<td>" + object.meta_id            + "</td>"
             + "<td>" + object.speed.toFixed(1)   + "</td>"
             + "<td>" + Math.floor(object.top)    + "</td>"
             + "<td>" + Math.floor(object.left)   + "</td>"
             + "<td>" + Math.floor(object.bottom) + "</td>"
             + "<td>" + Math.floor(object.right)  + "</td>"
             + "</tr>";
    }
        
    var table = 
          "<table id='nodes'>"
        + "<tr>"
        + "<th><div style='width:40px;'>Id</div></th>"
        + "<th><div style='width:70px;'>Speed</div></th>"
        + "<th><div style='width:70px;'>top</div></th>"
        + "<th><div style='width:70px;'>left</div></th>"
        + "<th><div style='width:70px;'>bottom</div></th>"
        + "<th><div style='width:70px;'>right</div></th></tr>";
        
    for(var i=0; i<objects.length; ++i)
        table += add_row(objects[i]).replace("NaN","");
    
    table += "</table>";
    
    log.innerHTML += table;
}

function draw_log_time(t0, t1, t2, t3, t4, t5) {
    if(!debug)
        return;
        
    function add_row(title, time) {
        return "<tr><th>" + title + "</th><td>"
             + time.toFixed(3) + "ms</td></tr>"
    }
        
    log.innerHTML +=
       "<table id='benchmark'"
      + add_row("Preparation donnees",      t1-t0)
      + add_row("Lukas kanade",             t2-t1)
      + add_row("Tri des points",           t3-t2)
      + add_row("Rassemblement des points", t4-t3)
      + add_row("Affichage et son",         t5-t4)
      + "</table>";
}