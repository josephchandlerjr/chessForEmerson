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
    
export default (state = gameDataReducerDefaultState, action) => {
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