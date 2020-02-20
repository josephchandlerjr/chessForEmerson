import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
import { chessControl } from './control/control'
import { chessModel   } from './model/model'

import 'normalize.css/normalize.css'

const live = window.location.search === '?live=true' ? true : false
const gameData = chessControl.start(chessModel)


ReactDOM.render(<Chess 
                    control={chessControl}
                    gameData={gameData}
                    live={live}
                    />, 
                    document.getElementById('app'))
