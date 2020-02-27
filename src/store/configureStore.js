import { createStore, combineReducers } from 'redux'
import gameDataReducer from '../reducers/gameData'
import liveGameDataReducer from '../reducers/liveGameData'

export default () => {
    const store = createStore(
        combineReducers({
            liveGameData: liveGameDataReducer,
            gameData: gameDataReducer
        })
    )
    return store
}