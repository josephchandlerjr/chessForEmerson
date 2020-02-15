import React from 'react'
import Nav from './Nav'
import Status from './Status'
import Board from './Board'

export default class Chess extends React.Component {
    constructor(props) {
        super(props)
        this.control = this.props.control
        this.state = {
            gameData: this.props.gameData,
            flipped: undefined
        }
        this.handleFlipBoard = this.handleFlipBoard.bind(this)
        this.getPossibleMoves = this.getPossibleMoves.bind(this)
        this.makeMove = this.makeMove.bind(this)
        this.reset = this.reset.bind(this)
        this.setAutomatedColor = this.setAutomatedColor.bind(this)
    }

    getPossibleMoves(squareId) {
        let destinations = this.control.viewRequest({request: "validMoves", from: squareId});
        return Object.keys(destinations).join(" ")
    }

    handleFlipBoard() {
        let flipped = !this.state.flipped
        this.setState( () => ( { flipped } ) )
    }

    makeMove(to, from) {
        let gameData = this.control.viewRequest({ 
            request : "move",
            from : to,
            to : from
        })
        if (gameData) this.setState( () => ( { gameData } ) )
    }
    reset(evt) {
        evt.preventDefault()
        let gameData = this.control.viewRequest({ request : "reset" })
        this.setState( () => ( { gameData } ) )
    }

    setAutomatedColor(evt) {
        if(evt){
            let gameData = this.control.viewRequest( {request:"automate", color: evt.target.name} )
            if (gameData) this.setState( () => ( { gameData } ) )
        }
    }
    // colorToMove: colorToMove,
    // gameOver: gameOver,
    // isCheckmate: isCheckmate,
    render() {
        let gameData = Object.assign( this.state.gameData, 
            {flipped: this.state.flipped,
             getPossibleMoves: this.getPossibleMoves,
             makeMove: this.makeMove
            }
            )
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard}
                     reset={this.reset}
                     setAutomatedColor={this.setAutomatedColor} />
                <Status gameData={gameData}/>
                <Board gameData={gameData} />
            </div>
            
        )
    }
}