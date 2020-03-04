//Action Generators for live game

//SET_LIVE_GAME
export const setLiveGame = () => ({
    type: 'SET_LIVE_GAME'
})
//SET_LIVE_GAME_STATUS
export const setLiveGameStatus = (status = undefined) => ({
    type: 'SET_LIVE_GAME_STATUS',
    status
})
//SET_LIVE_GAME_SOCKET
export const setLiveGameSocket = (socket = undefined) => ({
    type: 'SET_LIVE_GAME_SOCKET',
    socket
})
//SET_LIVE_GAME_COLOR
export const setLiveGameColor = (color= undefined) => ({
    type: 'SET_LIVE_GAME_COLOR',
    color
})
