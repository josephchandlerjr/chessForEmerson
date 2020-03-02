import React from 'react'
import { connect } from 'react-redux'

class StatusMessage extends React.Component {
    generateMessage() {
        let colorToMove = this.props.colorToMove === 'w' ? 'White' : 'Black'
        let otherColor = colorToMove ==='White' ? 'Black' : 'White'
        if(this.props.gameOver) {
            let message = 'Game over.'
            if(this.props.checkmate) {
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

const mapStateToProps = (state) => {
    return {
        gameOver: state.gameData.gameOver,
        colorToMove: state.gameData.colorToMove,
        checkmate: state.gameData.checkmate
    }
}

export default connect(mapStateToProps)(StatusMessage)