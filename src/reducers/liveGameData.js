//Reducers
//Live Game Data Reducer
const liveGameDataReducerDefaultState = {
    live: false,
    status: undefined,
    socket: undefined,
    color: undefined
}
export default (state = liveGameDataReducerDefaultState, action) => {
switch (action.type) {
    case 'SET_LIVE_GAME':
        return {
            ...state,
            live: !state.live
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