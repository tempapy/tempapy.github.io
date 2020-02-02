var c = document.getElementById('c');
var canvas_container = document.getElementById('canvas-container');
fit(c);

function fit(c){
  c.height=canvas_container.getBoundingClientRect().height;
  c.width=canvas_container.getBoundingClientRect().width;
  const width = c.clientWidth;
  const height = c.clientHeight;
  const ctx = c.getContext("2d", {alpha: false});
  ctx.beginPath();
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height);
  ctx.stroke();
}