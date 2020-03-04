import React from 'react'
import ReactDOM from 'react-dom'
import Chess from './components/Chess'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import { getMovesMap, setGameData } from './control/control'
import { setMovesMap, mirrorGameData} from './actions/gameData'
import { setLiveGame, setLiveGameStatus, setLiveGameColor, setLiveGameSocket } from './actions/liveGameData'

import 'normalize.css/normalize.css'
import './styles/styles.scss'

let store
const socket = io()

socket.on('setColor',(color) => {
    store.dispatch(setLiveGameColor(color))
    store.dispatch(setLiveGameStatus('found'))
})
socket.on('mirrorGameData', (gameData) => {
    store.subscribe( () => store.getState())
    store.dispatch(mirrorGameData(gameData))
})

socket.on('opponentLeft', () => {
    store.dispatch(setLiveGameStatus('disconnect'))
})

const initLive = () => {
    init()
    store.dispatch(setLiveGameSocket(socket))
    store.dispatch(setLiveGame())
    store.dispatch(setLiveGameStatus('waiting'))
    socket.emit('findOpponent')
}

const init = () => {
    store = configureStore()
    const startState = store.getState()
    store.dispatch(setMovesMap(getMovesMap(startState.gameData.board)))
    setGameData(store.getState().gameData)

    const jsx = (
        <Provider store={store}>
            <Chess init={init}
                   initLive={initLive} />
        </Provider>
    )
    ReactDOM.render(jsx, document.getElementById('app'))
}

init()


