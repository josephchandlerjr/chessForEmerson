//Game Data Reducer
const gameDataReducerDefaultState = {
    board: { 
        a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
        a7: "bp", b7: "bp", c7: "bp", d7: "bp", e7: "bp", f7: "bp", g7: "bp", h7: "bp",
        a6: "00", b6: "00", c6: "00", d6: "00", e6: "00", f6: "00", g6: "00", h6: "00",
        a5: "00", b5: "00", c5: "00", d5: "00", e5: "00", f5: "00", g5: "00", h5: "00",
        a4: "00", b4: "00", c4: "00", d4: "00", e4: "00", f4: "00", g4: "00", h4: "00",
        a3: "00", b3: "00", c3: "00", d3: "00", e3: "00", f3: "00", g3: "00", h3: "00", 
        a2: "wp", b2: "wp", c2: "wp", d2: "wp", e2: "wp", f2: "wp", g2: "wp", h2: "wp", 
        a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    },
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