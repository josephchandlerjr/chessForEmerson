import { chessControl } from './control/control.mjs'
import { chessModel   } from './model/model.mjs'
import { chessView    } from './view/view.mjs'
 
const socket = io()

chessControl.start(chessModel, chessView)

chessControl.makeLive()


socket.emit('findOpponent')

socket.on('move', ({from, to}) => {
	chessControl.requestMove(from, to)
})

socket.on('setColor', (color) => {
	console.log('color is', color)
	chessControl.startLiveGame(socket, color)
})