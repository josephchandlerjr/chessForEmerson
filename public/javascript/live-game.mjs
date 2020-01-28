import { chessControl } from './control/control.mjs'
import { chessModel   } from './model/model.mjs'
import { chessView    } from './view/view.mjs'
 
const socket = io()

chessControl.start(chessModel, chessView)

chessControl.makeLive(socket)


socket.emit('findOpponent')

socket.on('move', ({from, to}) => {
	console.log('here')
	chessControl.requestMove(from, to)
})