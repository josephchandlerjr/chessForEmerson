import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { reset } from '../actions/gameData'
import { setLiveGameStatus, setLiveGame } from '../actions/liveGameData'

Modal.setAppElement('#app') // removes console error

class LiveModal extends React.Component {
    constructor(props) {
        super(props)
        this.confirm = this.confirm.bind(this)
        this.cancel = this.cancel.bind(this)
    }
    generateMessage() {
        let status = this.props.status
        if(status === 'waiting') return 'Waiting for opponent. You will be paired with the next user to access live game mode. Click cancel to end live game mode. '
        if(status === 'found') return `Your opponent has arrived. You will be playing as ${this.props.color}. Good luck!`
        if(status === 'disconnect') return 'Your opponent has disconnected. Click OK to find a new opponent or click Cancel to end live game mode.'
        if(status === 'game-over') return 'This game is over. Click OK to find a new opponent or click Cancel to end live game mode.'
        if(status === 'abort') return 'Are you sure? Click OK to end live game mode. Click Cancel to continue playing.'
    }
    confirm() {
        let status = this.props.status
        switch (status) {
            case 'found':
                return () => this.props.dispatch(setLiveGameStatus('playing'))
            case 'game-over':
                return () => this.props.dispatch(reset())
            case 'disconnect':
                return () => this.props.dispatch(reset())
            case 'abort':
                return () => {
                    this.props.dispatch(setLiveGame())
                    this.props.socket.emit('abort')
                    this.props.dispatch(reset())
                }
        }
    }
    cancel() { 
        let status = this.props.status     
        switch (status) {
            case 'waiting':
                return () => {
                    this.props.dispatch(setLiveGame())
                    this.props.socket.emit('abort')
                    this.props.dispatch(reset())
                }
            case 'game-over':
                return () => {
                    this.props.dispatch(setLiveGame())
                    this.props.dispatch(reset())
                }
            case 'disconnect':
                return () => {
                    this.props.dispatch(setLiveGame())
                    this.props.dispatch(reset())
                }
            case 'abort':
                return () => this.props.dispatch(setLiveGameStatus('playing'))
        }
    }
    render() {
        return (
            <Modal
                isOpen={['waiting', 'found', 'abort', 'game-over', 'disconnect'].includes(this.props.status)}
                contentLabel="Live game modal"
                closeTimeoutMS={500}
                className="live-modal"
                >
                <h3 className="live-modal__text">{this.generateMessage()}</h3>
                { this.props.status !== 'waiting' && <button onClick={this.confirm()}>OK</button> }
                { this.props.status !== 'found' && <button onClick={this.cancel()}>Cancel</button> }
            </Modal>
        )   
    }
}

const mapStateToProps = (state) => {
    return {
        color: state.liveGameData.color,
        live: state.liveGameData.live,
        socket: state.liveGameData.socket,
        status: state.liveGameData.status
    }
}

export default connect(mapStateToProps)(LiveModal)