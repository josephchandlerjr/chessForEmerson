// Action Generators for game
//SET_BOARD
export const setBoard = (board) => ({
    type: 'SET_BOARD',
    board
})
//SET_MOVES_MAP
export const setMovesMap = (movesMap) => ({
    type: 'SET_MOVES_MAP',
    movesMap
})
//ADD_MOVE
export const addMove = (move) => ({
    type: 'ADD_MOVE',
    move
})
//RESET_MOVES
export const resetMoves = () => ({
    type: 'RESET_MOVES'
})
//SET_GAME_OVER
export const setGameOver = (gameOver) => ({
    type: 'SET_GAME_OVER',
    gameOver
})
//SET_CHECKMATE
export const setCheckmate = (checkmate) => ({
    type: 'SET_CHECKMATE',
    checkmate
})
//SET_WINNER
export const setWinner = (winner = undefined) => ({
    type: 'SET_WINNER',
    winner
})
//SET_COLOR_TO_MOVE
export const setColorToMove = (color = undefined) => ({
    type: 'SET_COLOR_TO_MOVE',
    color
})
//SET_TARGET
export const setTarget = (target= []) => ({
    type: 'SET_TARGET',
    target
})
//SET_SELECTED
export const setSelected = (selected = undefined) => ({
    type: 'SET_SELECTED',
    selected
})
