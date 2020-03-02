import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { setLiveGameStatus } from '../actions/liveGameData'

Modal.setAppElement('#app') // removes console error

class LiveModal extends React.Component {
    constructor(props) {
        super(props)
        this.updateStatus = this.updateStatus.bind(this)
    }
    generateMessage() {
        let status = this.props.status
        if(status === 'waiting') return 'Waiting for opponent to arrive...'
        if(status === 'found') return `Your opponent has arrived. You will be playing as ${this.props.color}.`
        if(status === 'disconnect') return 'Your opponent has disconnected. Click OK to find a new opponent.'
        if(status === 'game-over') return 'Game Over. Click OK to find a new opponent.'
    }
    updateStatus() {
        let status = this.props.status

        if(status === 'found') return this.props.dispatch(setLiveGameStatus('playing'))
        window.location.reload()
    }
    render(){
        return (
            <Modal
                isOpen={['waiting', 'found', 'disconnect', 'game-over'].includes(this.props.status)}
                contentLabel="Live game modal"
                closeTimeoutMS={500}
                className="live-modal"
                >
                <h3 className="live-modal__text">{this.generateMessage()}</h3>
                {
                    this.props.status !== 'waiting' &&
                    <button onClick={this.updateStatus}>OK</button>
                }
            </Modal>
        )
        
    }

}

const mapStateToProps = (state) => {
    return {
        live: state.liveGameData.live,
        status: state.liveGameData.status,

    }
}

export default connect(mapStateToProps)(LiveModal)