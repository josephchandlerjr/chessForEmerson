import React from 'react'
import Nav from './Nav'
import Status from './Status'
import Board from './Board'

export default class Chess extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props.gameData)
        this.state = {
            gameData: this.props.gameData,
            flipped: undefined
        }
        this.handleFlipBoard = this.handleFlipBoard.bind(this)
    }

    handleFlipBoard() {
        let flipped = !this.state.flipped
        this.setState( () => ( { flipped } ) )
    }

    render() {
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard} />
                <Status />
                <Board gameData={Object.assign(this.state.gameData, {flipped: this.state.flipped})} />
            </div>
            
        )
    }
}