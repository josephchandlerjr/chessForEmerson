import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
import { chessControl } from './control/control'
import { chessModel   } from './model/model'


const gameData = chessControl.start(chessModel)
 

ReactDOM.render(<Chess 
                    chessControl={chessControl}
                    gameData={gameData} 
                    />, 
                    document.getElementById('app'))