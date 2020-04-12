const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3000

const robot = require("robotjs")

app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'))

function onConnection(socket){
  socket.on('drawing', data => {
    // robot.moveMouse(data.x0, data.y0)
    // robot.mouseToggle("down")
    robot.moveMouse(data.x1, data.y1)
    // robot.mouseToggle("up")
  })
  socket.on('down', () => robot.mouseToggle("down"))
  socket.on('up', () => robot.mouseToggle("up"))
}
// robot.mouseToggle
// socket.broadcast.emit('drawing', data)


io.on('connection', onConnection);
http.listen(port, () => console.log('listening on port ' + port));

const screenSize = robot.getScreenSize();



// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
