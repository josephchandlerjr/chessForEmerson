const express 		= require('express'),
	  app			= express(),
	  path 			= require('path'),
	  http			= require('http'),
	  socketio		= require('socket.io'),
	  port			= process.env.PORT || 3000


const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

const server = http.createServer(app)
const io = socketio(server)
let queue = []

io.on('connection', (socket) => {
	socket.on('findOpponent', () => {
		if(queue.length > 0) {
			socket.opponentSocket = queue.shift()
			socket.opponentSocket.opponentSocket = socket
			socket.emit('setColor', 'black')
			socket.opponentSocket.emit('setColor', 'white')
		} else {
			queue.push(socket)
		}

		socket.on('move', (moveData) => {
			socket.opponentSocket.emit('move', moveData)
		})

		socket.on('disconnect', () => {
			queue = queue.filter( (s) => s !== socket)
			if(socket.opponentSocket) socket.opponentSocket.emit('opponentLeft')
		})

		socket.on('gameOver', () => {
			if(socket.opponentSocket) socket.opponentSocket.emit('gameOver')
			socket.emit('gaveOver')

		})

	})
})

server.listen(port, () => console.log('Listening on port 3000'))
