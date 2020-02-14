import React from 'react'
import Nav from './Nav'
import Status from './Status'
import Board from './Board'

export default class Chess extends React.Component {
    constructor(props) {
        super(props)
        this.control = this.props.control
        console.log(this.getPossibleMoves('a2'))
        this.state = {
            gameData: this.props.gameData,
            flipped: undefined
        }
        this.handleFlipBoard = this.handleFlipBoard.bind(this)
        this.getPossibleMoves = this.getPossibleMoves.bind(this)
    }

    getPossibleMoves(squareId) {
        let destinations = this.control.viewRequest({request: "validMoves", from: squareId});
        return Object.keys(destinations).join(" ")
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
                <Board gameData={Object.assign( this.state.gameData, 
                                                {flipped: this.state.flipped,
                                                 getPossibleMoves: this.getPossibleMoves
                                                }
                                                )} />
            </div>
            
        )
    }
}