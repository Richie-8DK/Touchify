const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3000

const robot = require("robotjs")
const screenshot = require('desktop-screenshot')
const sharp = require('sharp')

app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'))
sharp.cache(false)

function onConnection(socket){
  socket.on('drawing', data => {
    // robot.moveMouse(data.x0, data.y0)
    // robot.mouseToggle("down")
    robot.moveMouse(data.x1, data.y1)
    // robot.mouseToggle("up")
  })
  socket.on('down', () => robot.mouseToggle("down"))
  socket.on('up', () => robot.mouseToggle("up"))
  socket.on('updateView', updateView)
}


io.on('connection', onConnection)
http.listen(port, () => console.log('listening on port ' + port))


function updateView({x, y, width, height}) {
  screenshot("public/screenshot.jpeg", {quality: 80}, (error, complete) => {
    if(error)
        console.log("Screenshot failed", error)
    else
        console.log("Screenshot succeeded")
        sharp('public/screenshot.jpeg').extract({
          left: x,
          top: y,
          width,
          height
        }).toFile('public/area.jpeg')
        .then(new_file_info => {
            console.log("Image cropped and saved")
            io.emit('changeView', {msg: 'hi'})
        })
        .catch(err => {
            console.log("An error occured")
            console.log(err)
        })
  })
}

// updateView(100, 100, 300, 300)


// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
