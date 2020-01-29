const express 		= require('express'),
	  app			= express(),
	  path 			= require('path'),
	  http			= require('http'),
	  socketio		= require('socket.io')


const publicPath = path.join(__dirname, '../public')

console.log(publicPath)

app.set('view engine', 'ejs')
app.use(express.static(publicPath))


app.get('/', (req, res) => {
	res.render('index', {live: false})
})

app.get('/vs', (req, res) => {
	res.render('index', { live: true})
})


const server = http.createServer(app)
const io = socketio(server)

const queue = []

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

		socket.on('disconnect', function() {
			queue.filter( (s) => s !== this)
			if(this.opponentSocket) this.opponentSocket.emit('opponentLeft')
		})

	})
})

server.listen(3000, () => console.log('Listening on port 3000'))
