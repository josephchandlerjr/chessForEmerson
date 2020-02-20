import React from 'react'

export default class Status extends React.Component {
    generateMessage() {
        let colorToMove = this.props.gameData.colorToMove === 'w' ? 'White' : 'Black'
        let otherColor = colorToMove ==='White' ? 'Black' : 'White'
        if(this.props.gameData.gameOver) {
            let message = 'Game over.'
            if(this.props.gameData.isCheckmate) {
                message += `${otherColor} wins by checkmate.`
            } else {
                message += 'Draw.'
            }
            return message
        } else {
            return `${colorToMove}'s move`
        }
    }
    render() {
        return (
            <div id="status">
                <h2>{this.generateMessage()}</h2>
            </div>
        )
    }
}