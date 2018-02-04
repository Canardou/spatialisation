var json = [];

function logToJson(objects){
    if ( typeof logToJson.counter == 'undefined' ) {
        logToJson.counter = 0;
    }
    
    document.getElementById("save_data_log").innerHTML = " ("+json.length+" entries)"
    
    if(objects.length == 0){
        logToJson.counter++;
        return;
    }
        
    var items = [];
    for(var i=0; i < objects.length; i++){
        var object = objects[i];
        items.push({
            id:object.meta_id, 
            bounding_box:{
                left:object.left,
                right:object.right,
                top:object.top,
                bottom:object.bottom
            },
            velocity:{
                x:object.direction.x*object.speed,
                y:object.direction.y*object.speed
            }
        })
    }

    json.push({
        id:logToJson.counter++,
        objects:items
    })
}

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}
