import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
// import { chessControl } from './control/control'
// import { chessModel   } from './model/model'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import { getMovesMap, setGameData, getGameData } from './control/control'
import { setMovesMap } from './actions/gameData'

import 'normalize.css/normalize.css'
import './styles/styles.scss'

let store

const init = () => {
    store = configureStore()
    const startState = store.getState()
    store.dispatch(setMovesMap(getMovesMap(startState.gameData.board)))

    setGameData(store.getState().gameData)
    store.subscribe( () => console.log(store.getState()))
    const live = window.location.search === '?live=true' ? true : false
    //const gameData = chessControl.start(chessModel)

    const jsx = (
        <Provider store={store}>
            <Chess init={init} live={live} />
        </Provider>
    )

    ReactDOM.render(jsx, document.getElementById('app'))
}

init()


