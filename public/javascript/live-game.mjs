import { chessControl } from './control/control.mjs'
import { chessModel   } from './model/model.mjs'
import { chessView    } from './view/view.mjs'
 
const socket = io()

chessControl.start(chessModel, chessView)

chessControl.makeLive()
chessView.setStatus('Waiting for opponent...')


socket.emit('findOpponent')

socket.on('move', ({from, to}) => {
	chessControl.requestMove(from, to)
})

socket.on('setColor', (color) => {
	chessView.setStatus('White to move.')
	chessControl.startLiveGame(socket, color)
})

socket.on('opponentLeft', (msg) => {
	alert('Your opponent has disconnected.\n Please refresh page to find a new opponent')
})