const socket = io()
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

let state = {
  color: 'black'
}
let drawing = false
let pos = {
  x: 0,
  y: 0
}


// self.webView.scrollView.bounces = NO; // no scroll-reload ios :|


canvas.addEventListener('mousedown', onMouseDown, false)
canvas.addEventListener('mouseup', onMouseUp, false)
canvas.addEventListener('mouseout', onMouseUp, false)
canvas.addEventListener('mousemove', throttle(onMouseMove, 30), false)

//Touch support for mobile devices
canvas.addEventListener('touchstart', onMouseDown, false)
canvas.addEventListener('touchend', onMouseUp, false)
canvas.addEventListener('touchcancel', onMouseUp, false)
canvas.addEventListener('touchmove', throttle(onMouseMove, 30), false)
canvas.ontouchend = e => {
  e.preventDefault()
  socket.emit('up')
}

window.addEventListener('resize', updateView, false)
document.getElementById('fs').addEventListener('click', toggleFullscreen)
document.getElementById('uv').addEventListener('click', updateView)

socket.on('changeView', reloadimg)
updateView()

function toggleFullscreen() {
  if (document.fullscreen) {
    document.exitFullscreen()
  } else {
    document.getElementById('app').requestFullscreen()
  }
}


function reloadimg() {
  console.log('hi')
  canvas.style = "background-image: url('./area.jpeg?random="+ new Date().getTime() +"');"
}

function drawLine(x0, y0, x1, y1, color, emit) {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.strokeStyle = color
  context.lineWidth = 2
  context.stroke()
  context.closePath()

  if (!emit) { return }
  let w = canvas.width
  let h = canvas.height

  socket.emit('drawing', {
    x0: x0,
    y0: y0,
    x1: x1,
    y1: y1
  })
}

function onMouseDown(e) {
  e.preventDefault()
  drawing = true
  state.x = e.clientX || e.touches[0].clientX
  state.y = e.clientY || e.touches[0].clientY
  context.fillRect(state.x, state.y, 1, 1)
  drawLine(state.x, state.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, state.color, true)
  socket.emit('down')
}

function onMouseUp(e) {
  e.preventDefault()
  if (!drawing) { return }
  drawing = false
  drawLine(state.x, state.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, state.color, true)
  socket.emit('up')
}

function onMouseMove(e) {
  e.preventDefault()
  if (!drawing) { return }
  drawLine(state.x, state.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, state.color, true)
  state.x = e.clientX || e.touches[0].clientX
  state.y = e.clientY || e.touches[0].clientY
}



// function onDrawingEvent(data) {
//   let w = canvas.width
//   let h = canvas.height
//   drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, state.color)
// }

// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}


function updateView() {
  socket.emit('updateView', {
    x: pos.x,
    y: pos.y,
    width: window.innerWidth,
    height: window.innerHeight
  })
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}