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
            if(this.props.live){
                this.props.initLive()
            } else {
                this.props.init()
            }
        }
    }
    render() {
        return (
            <div>
                <Nav handleFlipBoard={this.handleFlipBoard}
                     reset={this.reset}
                     setAutomatedColor={this.setAutomatedColor} 
                     live={this.props.live}/>
                <StatusMessage />
                <Board />
                <LiveModal />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reset: state.gameData.reset,
        live: state.liveGameData.live
    }
}
export default connect(mapStateToProps)(Chess)