import { createStore, combineReducers } from 'redux'


//Action Generators for live game

//SET_LIVE_GAME
const setLiveGame = (live) => ({
    type: 'SET_LIVE_GAME',
    live
})
//SET_LIVE_GAME_STATUS
const setLiveGameStatus = (status = undefined) => ({
    type: 'SET_LIVE_GAME_STATUS',
    status
})
//SET_LIVE_GAME_SOCKET
const setLiveGameSocket = (socket = undefined) => ({
    type: 'SET_LIVE_GAME_SOCKET',
    socket
})
//SET_LIVE_GAME_COLOR
const setLiveGameColor = (color= undefined) => ({
    type: 'SET_LIVE_GAME_COLOR',
    color
})

// Action Generators for game
//SET_BOARD
const setBoard = (board) => ({
    type: 'SET_BOARD',
    board
})
//SET_MOVES_MAP
const setMovesMap = (movesMap) => ({
    type: 'SET_MOVES_MAP',
    movesMap
})
//ADD_MOVE
const addMove = (move) => ({
    type: 'ADD_MOVE',
    move
})
//RESET_MOVES
const resetMoves = () => ({
    type: 'RESET_MOVES'
})
//SET_GAME_OVER
const setGameOver = (gameOver) => ({
    type: 'SET_GAME_OVER',
    gameOver
})
//SET_CHECKMATE
const setCheckmate = (checkmate) => ({
    type: 'SET_CHECKMATE',
    checkmate
})
//SET_WINNER
const setWinner = (winner = undefined) => ({
    type: 'SET_WINNER',
    winner
})
//SET_COLOR_TO_MOVE
const setColorToMove = (color = undefined) => ({
    type: 'SET_COLOR_TO_MOVE',
    color
})


//Reducers
//Live Game Data Reducer
const liveGameDataReducerDefaultState = {
        live: false,
        status: undefined,
        socket: undefined,
        color: undefined
    }
const liveGameDataReducer = (state = liveGameDataReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_LIVE_GAME':
            return {
                ...state,
                live: action.live
            }
            case 'SET_LIVE_GAME_STATUS':
                return {
                    ...state,
                    status: action.status
                }
            case 'SET_LIVE_GAME_SOCKET':
                return {
                    ...state,
                    socket: action.socket
                }
            case 'SET_LIVE_GAME_COLOR':
                return {
                    ...state,
                    color: action.color
                }
        default:
            return state
    }
}

//Game Data Reducer
const gameDataReducerDefaultState = {
    board: {},
    movesMap: {},
    moves: [],
    gameOver: false,
    checkmate: false,
    winner: undefined,
    colorToMove: undefined
    }
const gameDataReducer = (state = gameDataReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return {
                ...state,
                board: action.board
            }
        case 'SET_MOVES_MAP':
            return {
                ...state,
                movesMap: action.movesMap
            }
        case 'ADD_MOVE':
            return {
                ...state,
                moves: state.moves.concat(action.move)
            }
        case 'RESET_MOVES':
            return {
                ...state,
                moves: []
            }
        case 'SET_GAME_OVER':
            return {
                ...state,
                gameOver: action.gameOver
            }
        case 'SET_CHECKMATE':
            return {
                ...state,
                checkmate: action.checkmate
            }
        case 'SET_WINNER':
            return {
                ...state,
                winner: action.winner
            }
        case 'SET_COLOR_TO_MOVE':
            return {
                ...state,
                colorToMove: action.color
            }
        default:
            return state
    }
}

const store = createStore(
    combineReducers({
        liveGameData: liveGameDataReducer,
        gameData: gameDataReducer
    })
)

console.log(store.getState())

store.subscribe( () => console.log(store.getState()))


