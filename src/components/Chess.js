import React from 'react'
import Nav from './Nav'
import StatusMessage from './StatusMessage'
import Board from './Board'
import LiveModal from './LiveModal'
import { connect } from 'react-redux'
import { setBoard } from '../actions/gameData'

class Chess extends React.Component {
    constructor(props) {
        super(props)
        this.control = this.props.control
        this.state = {
            gameData: this.props.gameData,
            // flipped: undefined,
            liveGameInfo: this.props.live ? { status: 'waiting'} : {}
        }
        this.makeMove = this.makeMove.bind(this)
        this.reset = this.reset.bind(this)
        this.setAutomatedColor = this.setAutomatedColor.bind(this)
        this.update = this.update.bind(this)
    }

    update(gameData, liveGameInfo={}) {
        console.log('here are the args')
        console.log(gameData)
        console.log(liveGameInfo)
        if (gameData) this.setState( () => ( { gameData } ) )
        this.setState( () => ( { liveGameInfo } ) )
    }

    makeMove(to, from) {
        let gameData = this.control.viewRequest({ 
            request : "move",
            from : to,
            to : from
        })
        if (gameData) this.props.dispatch(setBoard(gameData.board))
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

    componentDidMount() {
        if (this.props.live) {
            const socket = io()
        
            this.props.control.makeLive(this.update)
        
            socket.emit('findOpponent')
        
            socket.on('move', ({from, to}) => {
                let gameData = this.props.control.viewRequest({request:"mirrorOpponentMove", from, to})
                this.update(gameData)
            })
        
            socket.on('setColor', (color) => {
                this.props.control.startLiveGame(socket, color)
            })
        
            socket.on('opponentLeft', () => {
                this.update(null, {status: 'disconnect'})
            })
        
            socket.on('gameOver', () => {
                this.update(null,  {status: 'game-over'} )
            })
        }
    }
    
    render() {
        let gameData = Object.assign( this.state.gameData, 
            {
             makeMove: this.makeMove,
             live: this.props.live
            }
            )
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard}
                     reset={this.reset}
                     setAutomatedColor={this.setAutomatedColor} 
                     live={this.props.live}/>
                <StatusMessage gameData={gameData}/>
                <Board gameData={gameData} />
                <LiveModal liveGameInfo={this.state.liveGameInfo}
                            updateStatus={ (status) => {
                                this.update(null, {status})
                            }}/>
            </div>
            
        )
    }
}

export default connect()(Chess)