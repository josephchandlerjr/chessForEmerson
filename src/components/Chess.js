import React from 'react'
import Nav from './Nav'
import StatusMessage from './StatusMessage'
import Board from './Board'
import LiveModal from './LiveModal'
import { connect } from 'react-redux'

class Chess extends React.Component {
    constructor(props) {
        super(props)
        this.reset = this.reset.bind(this)
        this.setAutomatedColor = this.setAutomatedColor.bind(this)
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
    
    componentDidUpdate() {
        if (this.props.reset === true) {
            this.props.init()
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
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard}
                     reset={this.reset}
                     setAutomatedColor={this.setAutomatedColor} 
                     live={this.props.live}/>
                <StatusMessage //gameData={gameData}
                />
                <Board //gameData={gameData} 
                />
                <LiveModal  //liveGameInfo={this.state.liveGameInfo}
                            // updateStatus={ (status) => {
                            //     this.update(null, {status})
                            // }}
                            />
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reset: state.gameData.reset
    }
}
export default connect(mapStateToProps)(Chess)