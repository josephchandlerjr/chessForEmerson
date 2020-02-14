import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
import { chessControl } from './control/control'
import { chessModel   } from './model/model'
import { chessView    } from './view/view'
 

ReactDOM.render(<Chess />, document.getElementById('app'))