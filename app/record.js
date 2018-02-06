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
            x:object.middle.x,
            y:object.middle.y,
            width:object.right-object.left,
            height:object.bottom-object.top
        })
    }

    json.push({
        frame:logToJson.counter++,
        objects:items
    })
}

function download(text, name, type) {
    window.URL = window.URL || window.webkitURL;
    
    var file = new Blob([text], {type: type});
    
    var link = document.getElementById("link");
    link.href = window.URL.createObjectURL(file);
    
    link.download = name;
    link.click();
}
