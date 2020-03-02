export const destinations = ( (data, id) => {
    const possibleMoves = data.movesMap[id]
    const destinations = Object.keys(possibleMoves).join(" ")
    return destinations
})

