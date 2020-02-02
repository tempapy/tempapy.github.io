let model;

async function app() {
  console.log('Loading model...');
  model = await tf.loadLayersModel('model/model.json');
  console.log('Loaded');
}

app();


var c = document.getElementById('c');
var clear_btn = document.getElementById('clear-btn');
var brush_size = document.getElementById('brush-size');
var undo_btn = document.getElementById('undo-btn');
var redo_btn = document.getElementById('redo-btn');
var paint_btn = document.getElementById('paint-btn');
var hidden_c = document.getElementById('hidden-c');
var color0 = document.getElementById('color0');
var color1 = document.getElementById('color1');
var color2 = document.getElementById('color2');
var color3 = document.getElementById('color3');

function hexToRgb(hex) {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                 ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));
} 

var pathArray = new Array();
var path = new Path2D();

var radius = 2**Number(brush_size.value-1);
var color = '#000000';

// find position in canvas, from mouse event
function getXY(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
        var source = evt.touches ? evt.touches[0] : evt;
        const x = source.clientX - rect.left;
        const y = source.clientY - rect.top;
        return {x, y};
}

// convert color from RGB triplet to hex code
// for example: 255, 0, 255 -> '#FF00FF'
function componentToHex(c) {
    const hex = Number(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
// start drawing
c.onmousedown = function(evt0) {
    radius = 2**Number(brush_size.value-1);
    color = document.querySelector('input[name="input-type"]:checked').value;
    // get canvas context and initial position
    const ctx = c.getContext("2d", {alpha: false});
    let p0 = getXY(c, evt0);
    // set callback function for mousemove event
    c.onmousemove = function(evt1) {
        // draw a line from previous position to current position
        const p1 = getXY(c, evt1);
        var subpath = new Path2D();
        subpath.moveTo(p0.x, p0.y);
        subpath.lineTo(p1.x, p1.y);
        path.addPath(subpath);
        path.strokeStyle = color;
        path.fillStyle = color;
        path.lineWidth = radius;
        path.lineCap = "round";
        path.lineJoin = "round";
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = radius;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fill(subpath);
        ctx.stroke(subpath);
        // update position 
        p0 = p1;
    };
};

// remove callback function when mouse up
c.onmouseup = function(evt) {
    c.onmousemove = {};
    cPush();
};

// clear c when clicking on clear-btn
clear_btn.onclick = function() {
    const width = c.clientWidth;
    const height = c.clientHeight;
    const ctx = c.getContext("2d", {alpha: false});
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
    pathArray.length = 0; //clear path array
    cStep = -1;
    cPush();
}

// update HTML elements (RGB span, canvas_brush)
function updateDom() {
    // get value from range input 
    const radius = brush_size.value;
}
updateDom();

// set callback functions on HTML elements
brush_size.oninput = updateDom;




var cPushArray = new Array();
var cStep = -1;

function cPush(){
    cStep++;
    if (cStep < pathArray.length) { pathArray.length = cStep; }
    pathArray.push(path);
    path = new Path2D();
    document.title = cStep + ":" + pathArray.length;
    
}cPush();

undo_btn.onclick = function() {
    const ctx = c.getContext("2d", {alpha: false});
    if (cStep > 0) {
            const width = c.clientWidth;
    const height = c.clientHeight;
    const ctx = c.getContext("2d", {alpha: false});
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
        for (let i = 0; i < cStep; i++){
            ctx.beginPath();
            ctx.strokeStyle = pathArray[i].strokeStyle;
            ctx.fillStyle = pathArray[i].fillStyle;
            ctx.lineWidth = pathArray[i].lineWidth;
            ctx.lineCap = pathArray[i].lineCap;
            ctx.lineJoin = pathArray[i].lineJoin;
            ctx.fill(pathArray[i]);
            ctx.stroke(pathArray[i]);
        };
        cStep--;
        document.title = cStep + ":" + pathArray.length;
    }
    else{
        const width = c.clientWidth;
        const height = c.clientHeight;
        const ctx = c.getContext("2d", {alpha: false});
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height);
        ctx.stroke();
    }

}
redo_btn.onclick = function()  {
    const ctx = c.getContext("2d", {alpha: false});
    if (cStep < pathArray.length-1) {

        cStep++;
        
        for (let i = 0; i < cStep+1; i++){
            ctx.beginPath();
            ctx.strokeStyle = pathArray[i].strokeStyle;
            ctx.fillStyle = pathArray[i].fillStyle;
            ctx.lineWidth = pathArray[i].lineWidth;
            ctx.lineCap = pathArray[i].lineCap;
            ctx.lineJoin = pathArray[i].lineJoin;
            ctx.fill(pathArray[i]);
            ctx.stroke(pathArray[i]);
        };
        
        document.title = cStep + ":" + pathArray.length;
        
    }
}

paint_btn.onclick = function()  {

    var hidden_ctx = hidden_c.getContext("2d", {alpha: false});
    var imgData = hidden_ctx.createImageData(1024, 1024);
    var data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = 0;
      data[i+1] = 255; 
      data[i+2] = 0;
      data[i+3] = 255; 
      var x = i%(1024*4);
      var y = Math.floor(i/(1024*4));
      if ((x<256*4) && (y>=1000)){
        data[i] = hexToRgb(color0.value)[0];
        data[i+1] = hexToRgb(color0.value)[1];
        data[i+2] = hexToRgb(color0.value)[2];
        data[i+3] = 255; 
      }
      if ((x<512*4) && (x>=256*4) && (y>=1000)){
        data[i] = hexToRgb(color1.value)[0];
        data[i+1] = hexToRgb(color1.value)[1];
        data[i+2] = hexToRgb(color1.value)[2];
        data[i+3] = 255; 
      }
      if ((x<768*4) && (x>=512*4) && (y>=1000)){
        data[i] = hexToRgb(color2.value)[0];
        data[i+1] = hexToRgb(color2.value)[1];
        data[i+2] = hexToRgb(color2.value)[2];
        data[i+3] = 255; 
      }
      if ((x<1024*4) && (x>=768*4) && (y>=1000)){
        data[i] = hexToRgb(color3.value)[0];
        data[i+1] = hexToRgb(color3.value)[1];
        data[i+2] = hexToRgb(color3.value)[2];
        data[i+3] = 255; 
      }

    }

    var canvasPic = new Image();
    canvasPic.src = c.toDataURL('image/jpeg', 1.0);
    canvasPic.onload = function () { 
        if (canvasPic.height > canvasPic.width) {
            canvasPic.width = Math.floor(canvasPic.width * (1000 / canvasPic.height));
            canvasPic.height = 1000;
        }
        else {
            canvasPic.height = Math.floor(canvasPic.height * (1000 / canvasPic.width));
            canvasPic.width = 1000;
        }
        var canvas = document.createElement('canvas');
        h = canvasPic.height;
        w = canvasPic.width;
        canvas.height = h;
        canvas.width = w;
        var ctx = canvas.getContext('2d', {alpha: false});
        ctx.drawImage(canvasPic, 0, 0, w, h);
        console.log(w)
        console.log(h)
        var draw_imgdata = ctx.getImageData(0,0,w,h);
        var draw_data= draw_imgdata.data;
    
        for (var i = 0; i < draw_data.length; i ++) {
          var x = i%(w*4);
          var y = Math.floor(i/(w*4));
          data[y*1024*4+x] = draw_data[i];
          data[y*1024*4+x+1] = draw_data[i+1];
          data[y*1024*4+x+2] = draw_data[i+2];
        }
        hidden_ctx.putImageData(imgData, 0, 0);

        const input = tf.browser.fromPixels(imgData, 3);
        const inputData = input.dataSync();
        const floatInput = tf.tensor3d(inputData, input.shape, 'float32');
        const temp_normalizedInput = tf.div(floatInput, tf.scalar(255.0));
        const normalizedInput = tf.sub(tf.mul(temp_normalizedInput, tf.scalar(2)), tf.scalar(1));
        const normalizedInput_withBatch = normalizedInput.expandDims(0);
        const output = model.predict(normalizedInput_withBatch);
        const squeezedOutput = output.squeeze();
        const denormalizedOutput = tf.add(tf.mul(squeezedOutput , tf.scalar(0.5)), tf.scalar(0.5)); 
        var output_canvas = document.createElement('canvas');
        output_canvas.height = h;
        output_canvas.width = w;
        const promise = tf.browser.toPixels(denormalizedOutput, output_canvas);
        promise.then(function(){
            
            var formated_image = new Image();
            formated_image.src = output_canvas.toDataURL('image/jpeg', 1.0);
            formated_image.onload = function () { 
            document.write(formated_image.outerHTML);
        }
        });
        

        
        

        
    }


    


    
}