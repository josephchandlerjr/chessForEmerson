import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
import { chessControl } from './control/control'
import { chessModel   } from './model/model'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'

const store = configureStore()
console.log(store.getState())


import 'normalize.css/normalize.css'
import './styles/styles.scss'

const live = window.location.search === '?live=true' ? true : false
const gameData = chessControl.start(chessModel)


const jsx = (
    <Provider store={store}>
        <Chess control={chessControl} gameData={gameData} live={live} />
    </Provider>
)

ReactDOM.render(jsx , 
                    document.getElementById('app'))
