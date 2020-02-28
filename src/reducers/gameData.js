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
    movesMap: {
        a1: "", a2: "a3 a4", a3: "", a4: "", a5: "", a6: "", a7: "a5 a6", a8: "", 
        b1: "a3 c3", b2: "b3 b4", b3: "", b4: "", b5: "", b6: "", b7: "b5 b6", b8: "a6 c6", 
        c1: "", c2: "c3 c4", c3: "", c4: "", c5: "", c6: "", c7: "c5 c6", c8: "", 
        d1: "", d2: "d3 d4", d3: "", d4: "", d5: "", d6: "", d7: "d5 d6", d8: "", 
        e1: "", e2: "e3 e4", e3: "", e4: "", e5: "", e6: "", e7: "e5 e6", e8: "", 
        f1: "", f2: "f3 f4", f3: "", f4: "", f5: "", f6: "", f7: "f5 f6", f8: "", 
        g1: "f3 h3", g2: "g3 g4", g3: "", g4: "", g5: "", g6: "", g7: "g5 g6", g8: "f6 h6", 
        h1: "", h2: "h3 h4", h3: "", h4: "", h5: "", h6: "", h7: "h5 h6", h8: "",
    },
    moves: [],
    gameOver: false,
    checkmate: false,
    winner: undefined,
    colorToMove: "w",
    grabbed: false,
    selected: undefined,
    target: [],
    flipped: false
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
        case 'SET_TARGET':
            return {
                ...state,
                target: action.target
            }
        case 'SET_SELECTED':
            return {
                ...state,
                selected: action.selected
            }
        case 'TOGGLE_FLIPPED':
            return {
                ...state,
                flipped: !state.flipped
            }
        default:
            return state
    }
}
